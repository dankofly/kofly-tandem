/**
 * GSC "Indexierung beantragen" per Browser-Automation (Playwright).
 *
 * Warum: Die GSC-API kann Sitemaps einreichen und URLs inspizieren, aber NICHT
 * "Indexierung beantragen". Das geht nur ueber die Web-UI. Dieses Script bedient
 * die UI ueber ein dauerhaftes Chrome-Profil (einmaliger manueller Login, danach
 * gecacht). Nutzen nach jedem Deploy neuer oder nicht indexierter Seiten.
 *
 * Aufruf (aus dem Repo-Root):
 *   node ops/gsc/request-indexing.mjs <url1> <url2> ...
 *   node ops/gsc/request-indexing.mjs        # nutzt DEFAULT_URLS unten
 *
 * Erster Lauf: Chrome oeffnet sich, mit danielkofler@gmail.com in der GSC
 * einloggen (bis 10 Min Zeit). Danach laeuft es ohne Interaktion durch.
 * Screenshots je Schritt in ops/gsc/shots/.
 *
 * Grenzen: Google-Tageskontingent fuer "Indexierung beantragen" (~10-12 URLs
 * pro Property und Tag). Mehr URLs auf mehrere Tage verteilen.
 */
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROFILE = join(process.env.USERPROFILE || process.env.HOME, ".claude", "browser-profiles", "google-daniel");
const SHOTS = join(HERE, "shots");
const PROPERTY = "https://gleitschirm-tandemflug.com/";

const DEFAULT_URLS = [
  "https://gleitschirm-tandemflug.com/de/tandemflug-zettersfeld",
  "https://gleitschirm-tandemflug.com/de/tandemflug-osttirol",
  "https://gleitschirm-tandemflug.com/de/tandemflug-hochstein",
  "https://gleitschirm-tandemflug.com/de/gutschein",
  "https://gleitschirm-tandemflug.com/en/tandemflug-lienz",
];

const URLS = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_URLS;

const log = (m) => console.log(`[${new Date().toISOString().slice(11, 19)}] ${m}`);

(async () => {
  mkdirSync(SHOTS, { recursive: true });
  mkdirSync(PROFILE, { recursive: true });

  const ctx = await chromium.launchPersistentContext(PROFILE, {
    channel: "chrome",
    headless: false,
    viewport: { width: 1440, height: 900 },
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const page = ctx.pages()[0] || (await ctx.newPage());
  const shot = (name) => page.screenshot({ path: join(SHOTS, `${name}.png`) });

  const home =
    "https://search.google.com/search-console?resource_id=" +
    encodeURIComponent(PROPERTY);
  await page.goto(home, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(4000);

  if (new URL(page.url()).hostname === "accounts.google.com") {
    log("LOGIN NOETIG - bitte in Chrome einloggen (bis 10 Min)...");
    await page.waitForURL((u) => u.hostname === "search.google.com", { timeout: 600000 });
    log("Login erkannt.");
    await page.waitForTimeout(5000);
  }
  log(`Eingeloggt: ${page.url()}`);

  const findInspectBox = async () => {
    const cands = [
      page.getByRole("combobox").first(),
      page.locator('input[aria-label*="URL" i]').first(),
      page.locator('input[placeholder*="URL" i]').first(),
      page.locator('input[type="text"]').first(),
    ];
    for (const c of cands) if (await c.isVisible().catch(() => false)) return c;
    return null;
  };

  const results = [];
  for (const [i, url] of URLS.entries()) {
    const tag = `url${i + 1}-${url.split("/").pop()}`;
    try {
      log(`--- ${url}`);
      if (i > 0) {
        await page.goto(home, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(3000);
      }
      const box = await findInspectBox();
      if (!box) throw new Error("Inspektions-Suchleiste nicht gefunden");
      await box.click();
      await box.fill(url);
      await box.press("Enter");
      log("URL eingegeben, Inspektion laeuft...");

      const requestBtn = page.getByText(/indexierung beantragen|request indexing/i).first();
      await requestBtn.waitFor({ state: "visible", timeout: 120000 });
      await requestBtn.click();
      log("Klick: Indexierung beantragen. Warte auf Live-Pruefung (bis 3 Min)...");

      // Erfolg ueber den Dialog-Schliessen-Button erkennen: der Titeltext ist ins
      // DOM aufgeteilt und per getByText unzuverlaessig, der Button ist stabil.
      const closeBtn = page
        .getByRole("button", { name: /^(schließen|schliessen|close|ok|got it)$/i })
        .first();
      await closeBtn.waitFor({ state: "visible", timeout: 180000 });
      await shot(`${tag}-ergebnis`);

      const text = (await page.getByRole("dialog").first().textContent().catch(() => "")) || "";
      const ok = /beantragt|requested/i.test(text);
      log(`Ergebnis: ${ok ? "beantragt" : "unklar/Quota"} -> ${text.slice(0, 120)}`);
      results.push({ url, ok, text: text.slice(0, 200) });

      await closeBtn.click();
      await page.waitForTimeout(2000);
    } catch (e) {
      await shot(`${tag}-fehler`);
      log(`FEHLER: ${e.message.split("\n")[0]}`);
      results.push({ url, ok: false, text: `Fehler: ${e.message.split("\n")[0]}` });
    }
  }

  console.log("\n=== ZUSAMMENFASSUNG ===");
  for (const r of results) console.log(`${r.ok ? "OK  " : "FAIL"} ${r.url}`);
  const okCount = results.filter((r) => r.ok).length;
  console.log(`\n${okCount}/${results.length} beantragt.`);
  await ctx.close();
  process.exit(okCount === results.length ? 0 : 1);
})();
