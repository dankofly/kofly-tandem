import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { join } from "path";
import { ROUTES, LOCALES, SITE_URL } from "../../lib/routes";
import { REVIEWS } from "../../lib/reviews-config";

/**
 * SEO-Verifikation: prüft jede Route in jeder Sprache gegen die Registry
 * (lib/routes.ts). Läuft lokal gegen next start und per BASE_URL gegen live.
 *
 * Die Canonical-/hreflang-Erwartungen zeigen immer auf die Produktions-Domain
 * (SITE_URL), unabhängig davon, wo der Server läuft.
 */

// Was in der SERP zaehlt, ist der gerenderte Gesamttitel inklusive Suffix.
// Bis 2026-07-27 stand hier der alte 36-Zeichen-Suffix und wurde vor der
// Messung abgeschnitten; der Check konnte damit nichts mehr finden.
const TITLE_MAX = 60;
const DESC_MIN = 70;
const DESC_MAX = 160;

const messagesByLocale = Object.fromEntries(
  LOCALES.map((l) => [
    l,
    JSON.parse(readFileSync(join(__dirname, `../../messages/${l}.json`), "utf8")),
  ])
);

// SSR-Artefakte, die nie im HTML stehen dürfen (Review-Countup bei 0).
const ZERO_REVIEW_PATTERNS = [
  /aus 0\+? Bewertungen/i,
  /from 0\+? reviews/i,
  /uit 0\+? beoordelingen/i,
];

// Wording-Verbote (Daniel, 2026-08-05): "staatlich geprüft" ist sitewide
// tabu, erlaubt ist "erfahrene, zertifizierte Tandempiloten". Die
// Pionier-/Superlativ-Claims zu Daniel Kofler dürfen zusätzlich nicht in
// SERP-Feldern (Title, Descriptions, JSON-LD) stehen; Team-Body-Copy wie
// "der erfahrensten Tandempiloten Osttirols" bleibt bewusst erlaubt.
const FORBIDDEN_EVERYWHERE = [
  /staatlich gepr/i,
  /staatlich zertifiziert/i,
  /state-?certified/i,
  /state-?licensed/i,
  /staatsgecertificeerd/i,
  /staatsgediplomeerd/i,
  /staatsexamen/i,
];
const FORBIDDEN_IN_SERP_FIELDS = [
  /erfahrenster Tandempilot/i,
  /most experienced tandem pilot(?!s)/i,
  /Speedflying[- ]Pionier/i,
  /Speedflying[- ]pioneer/i,
  /Speedriding[- ]Pionier/i,
  /Pionier des Speedflying/i,
];

// Live-Modus (BASE_URL gesetzt): Bilder/Fonts/Media nicht laden. Alle
// Assertions arbeiten auf dem SSR-HTML; das volle Asset-Volumen von 61
// Seiten triggert sonst Netlifys Bot-Schutz (intermittierende 403).
// Gegen Produktion zusätzlich immer --workers=1 fahren.
test.beforeEach(async ({ page }) => {
  if (!process.env.BASE_URL) return;
  await page.route("**/*", (route) => {
    const type = route.request().resourceType();
    if (type === "image" || type === "media" || type === "font") {
      // Leere 200 statt abort(): abgebrochene Requests werfen unhandled
      // Rejections ("A network error occurred"), die der JS-Fehler-Check
      // sonst faelschlich als Seitenfehler meldet.
      return route.fulfill({ status: 200, body: Buffer.alloc(0) });
    }
    return route.continue();
  });
});

for (const route of ROUTES) {
  for (const locale of LOCALES) {
    const path = `/${locale}${route.path}`;
    const prodUrl = `${SITE_URL}${path}`;

    test(`SEO ${path}`, async ({ page, request }) => {
      // Echte Fehler einsammeln: uncaught Exceptions und 4xx/5xx-Subrequests.
      // Im Live-Modus abgebrochene Bild-/Font-Requests erzeugen keine
      // Response und landen deshalb nicht faelschlich hier.
      const pageErrors: string[] = [];
      page.on("pageerror", (e) => pageErrors.push(e.message));
      const badResponses: string[] = [];
      page.on("response", (r) => {
        if (r.status() >= 400) badResponses.push(`${r.status()} ${r.url()}`);
      });

      const response = await page.goto(path);
      expect(response?.status(), `HTTP-Status für ${path}`).toBe(200);

      // Genau ein Self-Canonical auf die Produktions-URL
      const canonicals = page.locator('link[rel="canonical"]');
      await expect(canonicals, `canonical fehlt/doppelt auf ${path}`).toHaveCount(1);
      expect(await canonicals.getAttribute("href")).toBe(prodUrl);

      // hreflang komplett und selbstreferenzierend
      for (const l of LOCALES) {
        const alt = page.locator(`link[rel="alternate"][hreflang="${l}"]`);
        await expect(alt, `hreflang ${l} fehlt auf ${path}`).toHaveCount(1);
        expect(await alt.getAttribute("href")).toBe(`${SITE_URL}/${l}${route.path}`);
      }
      const xDefault = page.locator('link[rel="alternate"][hreflang="x-default"]');
      await expect(xDefault).toHaveCount(1);
      expect(await xDefault.getAttribute("href")).toBe(`${SITE_URL}/de${route.path}`);

      // Genau eine H1
      await expect(page.locator("h1"), `H1-Anzahl auf ${path}`).toHaveCount(1);

      // Titel: gerenderter Gesamttitel maximal 60 Zeichen
      const title = await page.title();
      expect(
        title.length,
        `Titel zu lang (${title.length}): "${title}"`
      ).toBeLessThanOrEqual(TITLE_MAX);

      // Meta description in Ziel-Länge (nur indexierbare Seiten)
      const desc = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(desc, `description fehlt auf ${path}`).toBeTruthy();
      if (route.indexable) {
        expect(desc!.length, `description zu kurz: "${desc}"`).toBeGreaterThanOrEqual(DESC_MIN);
        expect(desc!.length, `description zu lang (${desc!.length})`).toBeLessThanOrEqual(DESC_MAX);
      }

      // OpenGraph vollständig, og:url == canonical
      expect(await page.locator('meta[property="og:type"]').getAttribute("content")).toBe("website");
      expect(await page.locator('meta[property="og:url"]').getAttribute("content")).toBe(prodUrl);
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
      await expect(page.locator('meta[property="og:site_name"]')).toHaveCount(1);

      // robots gemäß Registry
      const robotsMeta = await page.locator('meta[name="robots"]').first().getAttribute("content").catch(() => null);
      if (route.indexable) {
        expect(robotsMeta ?? "", `unerwartetes noindex auf ${path}`).not.toContain("noindex");
      } else {
        expect(robotsMeta ?? "", `noindex fehlt auf ${path}`).toContain("noindex");
      }

      // Alle JSON-LD-Blöcke parsen; Product-Rating aus der Config,
      // Organization ohne aggregateRating (Google-Policy)
      const ldBlocks = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      for (const block of ldBlocks) {
        const parsed = JSON.parse(block); // wirft bei kaputtem JSON
        const nodes = parsed["@graph"] ?? [parsed];
        for (const node of Array.isArray(nodes) ? nodes : [nodes]) {
          const types = ([] as string[]).concat(node["@type"] ?? []);
          if (types.includes("Product") && node.aggregateRating) {
            expect(node.aggregateRating.ratingCount).toBe(String(REVIEWS.countExact));
            expect(node.aggregateRating.ratingValue).toBe(REVIEWS.ratingValue);
          }
          if (types.includes("Organization")) {
            expect(node.aggregateRating, "Organization darf kein aggregateRating tragen").toBeUndefined();
            expect(node.review, "Organization darf keine self-serving Reviews tragen").toBeUndefined();
          }
        }
      }

      // Rohes SSR-HTML (ohne JS): kein "aus 0+ Bewertungen", kein doppelter Hero-Text
      const raw = await (await request.get(path)).text();
      for (const pattern of ZERO_REVIEW_PATTERNS) {
        expect(raw, `SSR zeigt Null-Review-Artefakt auf ${path}`).not.toMatch(pattern);
      }

      // Wording: sitewide-Verbote im kompletten SSR-HTML (inkl. RSC-Payload),
      // SERP-Verbote nur in Title, Descriptions und JSON-LD.
      for (const pattern of FORBIDDEN_EVERYWHERE) {
        expect(raw, `Verbotenes Wording ${pattern} auf ${path}`).not.toMatch(pattern);
      }
      const ogDesc =
        (await page.locator('meta[property="og:description"]').getAttribute("content").catch(() => null)) ?? "";
      const serpFields = [title, desc ?? "", ogDesc, ...ldBlocks].join("\n");
      for (const pattern of FORBIDDEN_IN_SERP_FIELDS) {
        expect(serpFields, `SERP-Feld trägt verbotenen Claim ${pattern} auf ${path}`).not.toMatch(pattern);
      }

      expect(pageErrors, `JS-Fehler auf ${path}: ${pageErrors.join(" | ")}`).toHaveLength(0);
      expect(badResponses, `Requests mit 4xx/5xx auf ${path}: ${badResponses.join(" | ")}`).toHaveLength(0);
      if (route.path === "") {
        const descLine1: string | undefined =
          messagesByLocale[locale]?.Hero?.descLine1;
        if (descLine1) {
          // Nur sichtbares HTML zählt: der RSC-Payload in <script>-Tags
          // enthält den Text zwangsläufig nochmal (serialisierte Messages).
          const visible = raw.replace(/<script[\s\S]*?<\/script>/gi, "");
          const count = visible.split(descLine1).length - 1;
          expect(count, `Hero-Text ${count}x im DOM (${path})`).toBeLessThanOrEqual(1);
        }
      }
    });
  }
}

test("Sitemap == indexierbare Registry-URLs, robots.txt verweist auf Sitemap", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  const expected = new Set<string>();
  for (const route of ROUTES) {
    if (!route.indexable) continue;
    for (const locale of LOCALES) expected.add(`${SITE_URL}/${locale}${route.path}`);
  }

  const actual = new Set(locs);
  const missing = [...expected].filter((u) => !actual.has(u));
  const extra = [...actual].filter((u) => !expected.has(u));
  expect(missing, `Sitemap fehlen URLs: ${missing.join(", ")}`).toHaveLength(0);
  expect(extra, `Sitemap enthält unerwartete URLs: ${extra.join(", ")}`).toHaveLength(0);

  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap: https://gleitschirm-tandemflug.com/sitemap.xml");
});

/**
 * Accessibility-Regressionen aus dem Skill-Durchlauf 2026-07-27.
 * Alle drei Punkte kamen aus der Vorlage von technical-seo-checker
 * ("Tap targets sized", "Mobile-friendly") und aus WCAG 2.4.1 / 2.5.8.
 * Eine Seite reicht: Header, Footer und die Crosslink-Muster sind geteilt.
 */
test.describe("Accessibility-Grundlagen", () => {
  test("Skip-Link zeigt auf #main und ist per Tastatur erreichbar", async ({ page }) => {
    await page.goto("/de");
    const skip = page.locator("a.skip-link");
    await expect(skip).toHaveCount(1);
    expect(await skip.getAttribute("href")).toBe("#main");
    await expect(page.locator("main#main")).toHaveCount(1);
    // Unsichtbar bis Fokus: oberhalb des Viewports geparkt.
    expect((await skip.boundingBox())!.y).toBeLessThan(0);
    await skip.focus();
    // Der Link faehrt per 0,2s-Transition ein, deshalb pollen statt sofort messen.
    await expect
      .poll(async () => (await skip.boundingBox())!.y, { timeout: 2000 })
      .toBeGreaterThanOrEqual(0);
  });

  test("Ueberschriften steigen ohne Sprung (h2 nach h1, kein h4 ohne h3)", async ({ page }) => {
    for (const path of ["/de", "/de/sicherheit", "/de/agb", "/de/tandemflug-lienz", "/de/ueber-uns", "/de/ablauf", "/de/buchen", "/de/urlaub", "/de/anreise", "/de/paragleiten"]) {
      await page.goto(path);
      const levels = await page.$$eval("h1,h2,h3,h4,h5,h6", (els) =>
        els.map((e) => Number(e.tagName[1]))
      );
      const skips = levels
        .map((lvl, i) => (i > 0 && lvl - levels[i - 1] > 1 ? `h${levels[i - 1]}->h${lvl}` : null))
        .filter(Boolean);
      expect(skips, `Ebenensprung auf ${path}: ${skips.join(", ")}`).toHaveLength(0);
    }
  });

  // WCAG 2.5.8 verlangt 24x24 px ODER genug Abstand: um jedes zu kleine Ziel
  // wird ein 24-px-Kreis gelegt, der kein anderes Ziel und keinen anderen
  // solchen Kreis schneiden darf. Der Footer besteht diese Alternative mit
  // 26 px Zeilenabstand. Der Test prueft deshalb beide Wege, nicht nur die
  // Groesse; sonst erzwingt er Layout-Aenderungen ohne Nutzen.
  for (const path of ["/de", "/de/sicherheit", "/de/buchen"]) {
    test(`Tap-Targets erfuellen Groesse oder Abstand (WCAG 2.5.8) auf ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 412, height: 915 });
      await page.goto(path);
      const violations = await page.$$eval("a,button,[role='button']", (els) => {
        const targets = els
          .map((el) => {
            const r = el.getBoundingClientRect();
            const p = el.parentElement;
            // Ausnahme "inline": Link mitten im Fliesstext, also wenn der
            // Elterntext neben dem Link noch eigenen Text traegt.
            const own = (el.textContent || "").trim();
            const around = ((p?.textContent || "").trim().replace(own, "")).trim();
            const inline =
              !!p && ["P", "LABEL", "SPAN"].includes(p.tagName) && around.length >= 3;
            // checkVisibility filtert eingeklappte Panels heraus: ein Element
            // mit visibility:hidden hat weiterhin ein Rechteck.
            const shown = el.checkVisibility({
              visibilityProperty: true,
              opacityProperty: true,
              contentVisibilityAuto: true,
            });
            return { r, inline, shown, txt: own.slice(0, 28) };
          })
          .filter((t) => t.shown && t.r.width > 0 && t.r.height > 0 && !t.inline);

        const undersized = targets.filter((t) => t.r.width < 24 || t.r.height < 24);
        const centre = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
        // Abstand Kreismittelpunkt zum naechsten Punkt eines Rechtecks.
        const distToRect = (c: { x: number; y: number }, r: DOMRect) => {
          const dx = Math.max(r.left - c.x, 0, c.x - r.right);
          const dy = Math.max(r.top - c.y, 0, c.y - r.bottom);
          return Math.hypot(dx, dy);
        };

        const bad: string[] = [];
        for (const t of undersized) {
          const c = centre(t.r);
          const hitsOther = targets.some((o) => o !== t && distToRect(c, o.r) < 12);
          const hitsCircle = undersized.some((o) => {
            if (o === t) return false;
            const oc = centre(o.r);
            return Math.hypot(oc.x - c.x, oc.y - c.y) < 24;
          });
          if (hitsOther || hitsCircle) {
            bad.push(
              `${t.txt || "(icon)"} ${Math.round(t.r.width)}x${Math.round(t.r.height)}`
            );
          }
        }
        return bad;
      });
      expect(
        violations,
        `Zu klein UND zu dicht: ${violations.join(" | ")}`
      ).toHaveLength(0);
    });
  }
});

/**
 * Das geschlossene Mobile-Menue darf nicht im Fokus-Pfad liegen. Vorher hielt
 * es max-height:0 nur optisch zu, die sechs Links blieben fokussierbar.
 */
test("Geschlossenes Mobile-Menue ist nicht fokussierbar", async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 915 });
  await page.goto("/de/sicherheit");
  const menu = page.locator("div.mobile-menu");
  await expect(menu).toHaveAttribute("data-open", "false");
  const links = menu.locator("a");
  expect(await links.count()).toBeGreaterThan(0);
  for (const l of await links.all()) {
    expect(
      await l.evaluate((el) => el.checkVisibility({ visibilityProperty: true })),
      "Link im geschlossenen Menue ist noch sichtbar/fokussierbar"
    ).toBe(false);
  }
  // Geoeffnet muss es wieder erreichbar sein.
  await page.locator("button[aria-expanded]").first().click();
  await expect(menu).toHaveAttribute("data-open", "true");
  await expect(links.first()).toBeVisible();
});

/**
 * Kontrast der reinen Text-Tokens (WCAG 2.1 AA, 4.5:1 fuer Text unter
 * 18.66px bold / 24px normal). faint und ghost tragen Footer-Labels,
 * Impressum, Datenschutz und den Tabellenkopf und lagen am 2026-07-27 bei
 * 2,32 bzw. 1,68 zu 1.
 *
 * Nicht abgedeckt und bewusst offen: weiss auf accent-500 (#e86830) ergibt
 * 3,25:1 und betrifft den primaeren CTA-Button. Das zu beheben heisst, das
 * Marken-Orange zu aendern, siehe Audit 2026-07-27.
 */
test.describe("Farbkontrast", () => {
  const SURFACES = {
    light: ["#f8fafb", "#eef3f6"],
    dark: ["#0a1a22", "#142832"],
  } as const;

  for (const theme of ["light", "dark"] as const) {
    test(`Text-Tokens erfuellen 4.5:1 (${theme})`, async ({ page }) => {
      await page.goto("/de", { waitUntil: "domcontentloaded" });
      // Gegen die Live-Domain kam der erste Lauf einmal an die Tokens, bevor
      // das inline-CSS angewandt war, und meldete damit einen Fehlschlag, der
      // sich nicht reproduzieren liess. Erst warten, bis ein Token aufloest.
      await expect
        .poll(
          async () =>
            page.evaluate(() =>
              getComputedStyle(document.documentElement)
                .getPropertyValue("--text-faint")
                .trim()
            ),
          { timeout: 5000 }
        )
        .toMatch(/^#[0-9a-f]{6}$/i);
      const measured = await page.evaluate(
        ({ mode, surfaces }) => {
          // globals.css scoped ueber [data-theme], nicht ueber Klassen.
          document.documentElement.setAttribute("data-theme", mode);
          const cs = getComputedStyle(document.documentElement);
          const hex = (h: string) =>
            [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
          const lum = ([r, g, b]: number[]) => {
            const f = (c: number) => {
              c /= 255;
              return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            };
            return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
          };
          const ratio = (a: number[], b: number[]) => {
            const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
            return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
          };
          const out: { token: string; bg: string; cr: number }[] = [];
          // accent-400/500 sind seit 2026-08-07 theme-abhaengig, weil das
          // frueher konstante #e86830 im Light-Theme nur 3,11:1 erreichte.
          // --accent-600 ist bewusst nicht dabei: aktuell nirgends als
          // Textfarbe verwendet und im Dark-Theme bei 4,23:1. Wer es
          // einsetzen will, muss vorher den Dark-Wert abdunkeln.
          for (const token of [
            "--text-faint",
            "--text-ghost",
            "--text-subtle",
            "--text-muted",
            "--accent-400",
            "--accent-500",
          ]) {
            const v = cs.getPropertyValue(token).trim();
            if (!/^#[0-9a-f]{6}$/i.test(v)) continue;
            for (const bg of surfaces) out.push({ token, bg, cr: ratio(hex(v), hex(bg)) });
          }
          return out;
        },
        { mode: theme, surfaces: SURFACES[theme] }
      );
      expect(measured.length, "keine Tokens gelesen").toBeGreaterThan(0);
      const failing = measured.filter((m) => m.cr < 4.5);
      expect(
        failing,
        `unter 4.5:1 -> ${failing.map((f) => `${f.token} auf ${f.bg} = ${f.cr}`).join(", ")}`
      ).toHaveLength(0);
    });
  }
});

/**
 * Layout-Raster.
 *
 * Hintergrund: Bis August 2026 sass die Regional-Box der Startseite auf 768px,
 * waehrend alle anderen Home-Module auf 1152px liegen. Weil die Box einen
 * sichtbaren Rahmen hat, war der Versatz von 384px direkt zu sehen. Der Fehler
 * hat einen kompletten Container-Refactor ueberlebt, weil nur geprueft wurde,
 * ob gleichnamige Container gleich breit sind, nie ob die Stufe zur Position
 * passt. Genau das prueft dieser Test.
 */
test.describe("Layout-Raster", () => {
  test("Regional-Kasten fluchtet mit dem WhyUs-Raster", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/de");

    const card = await page
      .locator('section .glass-card[class*="border-accent-500/20"]')
      .first()
      .boundingBox();
    // Gegen das Kachelraster messen, nicht gegen den Container: Der Container
    // traegt 24px padding-inline, der Kasten sitzt innerhalb davon. Beide
    // Elemente muessen auf derselben Ebene verglichen werden.
    const grid = await page.locator("#erlebnis .grid").first().boundingBox();

    expect(card, "Regional-Kasten nicht gefunden").not.toBeNull();
    expect(grid, "WhyUs-Raster nicht gefunden").not.toBeNull();

    expect(
      Math.abs(card!.x - grid!.x),
      `linke Kante: Kasten ${card!.x}, Raster ${grid!.x}`
    ).toBeLessThan(1);
    expect(
      Math.abs(card!.width - grid!.width),
      `Breite: Kasten ${card!.width}, Raster ${grid!.width}`
    ).toBeLessThan(1);
  });

  test("Textspalte im Regional-Kasten bleibt lesbar", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/de");

    const col = await page
      .locator('section .glass-card[class*="border-accent-500/20"] .max-w-prose')
      .first()
      .boundingBox();

    expect(col, "Textspalte nicht gefunden").not.toBeNull();
    // 65ch in Inter @16px liegt bei ~570px. Alles ueber 700px waere jenseits
    // der lesbaren Zeilenlaenge und hiesse, die Begrenzung wurde entfernt.
    expect(col!.width, `Textspalte ${col!.width}px`).toBeLessThan(700);
  });
});
