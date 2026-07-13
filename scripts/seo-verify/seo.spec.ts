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

const TITLE_SUFFIX = " | KOFLY - Gleitschirm-Tandemflug.com";
const TITLE_CORE_MAX = 60;
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

// Live-Modus (BASE_URL gesetzt): Bilder/Fonts/Media nicht laden. Alle
// Assertions arbeiten auf dem SSR-HTML; das volle Asset-Volumen von 61
// Seiten triggert sonst Netlifys Bot-Schutz (intermittierende 403).
// Gegen Produktion zusätzlich immer --workers=1 fahren.
test.beforeEach(async ({ page }) => {
  if (!process.env.BASE_URL) return;
  await page.route("**/*", (route) => {
    const type = route.request().resourceType();
    if (type === "image" || type === "media" || type === "font") {
      return route.abort();
    }
    return route.continue();
  });
});

for (const route of ROUTES) {
  for (const locale of LOCALES) {
    const path = `/${locale}${route.path}`;
    const prodUrl = `${SITE_URL}${path}`;

    test(`SEO ${path}`, async ({ page, request }) => {
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

      // Titel: Kern (ohne Brand-Suffix) maximal 60 Zeichen
      const title = await page.title();
      const core = title.endsWith(TITLE_SUFFIX)
        ? title.slice(0, -TITLE_SUFFIX.length)
        : title;
      expect(
        core.length,
        `Titel-Kern zu lang (${core.length}): "${core}"`
      ).toBeLessThanOrEqual(TITLE_CORE_MAX);

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
