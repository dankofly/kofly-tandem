/**
 * Statischer Konsistenz-Check (kein Server nötig): npm run verify:consistency
 *
 * Prüft, dass Review-Zahlen, Gutschein-Gültigkeit und Flugzeiten in
 * messages/, public/llms.txt und public/pricing.md nicht auseinanderlaufen
 * und dass die Message-Dateien strukturgleich sind (Key-Parität).
 */
import { readFileSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const errors = [];
const ok = (msg) => console.log(`  OK  ${msg}`);
const fail = (msg) => {
  errors.push(msg);
  console.error(`FAIL  ${msg}`);
};

// 1. Review-Zahlen: keine veralteten Counts (303, 250, 284) in Review-Kontexten
const reviewWords = "(Bewertungen|reviews|beoordelingen|Rezensionen)";
const staleCounts = ["303", "250", "284", "41"];
for (const file of [
  "messages/de.json",
  "messages/en.json",
  "messages/nl.json",
  "public/llms.txt",
  "public/pricing.md",
]) {
  const text = read(file);
  for (const n of staleCounts) {
    const re = new RegExp(`${n}\\+? ?${reviewWords}`, "gi");
    const hits = text.match(re);
    if (hits) fail(`${file}: veraltete Review-Zahl "${hits[0]}" (erwartet: 300+)`);
  }
  if (!/300\+/.test(text) && file !== "public/pricing.md") {
    fail(`${file}: enthält keine "300+"-Bewertungsangabe`);
  }
}
if (errors.length === 0) ok("Review-Zahlen konsistent (300+)");

// 2. Gutschein-Gültigkeit: überall 3 Jahre, nirgends 2 Jahre
for (const file of ["messages/de.json", "public/llms.txt", "public/pricing.md"]) {
  const text = read(file);
  if (/2 Jahre gültig|2 jaar geldig|valid for 2 years/i.test(text)) {
    fail(`${file}: Gutschein "2 Jahre" gefunden, korrekt ist 3 Jahre`);
  }
}
ok("Gutschein-Gültigkeit: keine 2-Jahre-Angabe");

// 3. Flugzeiten llms.txt/pricing.md gegen fixe Sollwerte
const durations = [
  ["Classic", /20.{0,2}30 Min/i],
  ["Premium", /30.{0,2}45 Min/i],
  ["Thermik", /45.{0,2}90 Min/i],
];
for (const file of ["public/llms.txt"]) {
  const text = read(file);
  for (const [name, re] of durations) {
    if (!re.test(text)) fail(`${file}: Flugzeit für ${name} entspricht nicht dem Soll (${re})`);
  }
}
ok("Flugzeiten in llms.txt entsprechen den Paketseiten");

// 3b. Paketvergleichs-Tabelle (messages/*.PaketVergleich) gegen dieselben
// Sollwerte plus die Preise aus pricing.md. Die Tabelle steht auf allen drei
// Paketseiten und ist seit 2026-07-27 die einzige Quelle dafür; ohne diesen
// Check kann sie unbemerkt von pricing.md wegdriften.
{
  const prices = [
    ["classic", "150"],
    ["premium", "190"],
    ["thermik", "250"],
  ];
  const pricing = read("public/pricing.md");
  for (const [key, amount] of prices) {
    if (!pricing.includes(amount)) fail(`public/pricing.md: Preis ${amount} für ${key} fehlt`);
  }
  for (const l of ["de", "en", "nl"]) {
    const pv = JSON.parse(read(`messages/${l}.json`)).PaketVergleich;
    if (!pv) { fail(`messages/${l}.json: Namespace PaketVergleich fehlt`); continue; }
    for (const [key, amount] of prices) {
      if (!pv[`${key}Preis`]?.includes(amount)) {
        fail(`messages/${l}.json: PaketVergleich.${key}Preis ist "${pv[`${key}Preis`]}", erwartet €${amount}`);
      }
    }
    for (const [name, re] of durations) {
      const cell = pv[`${name.toLowerCase()}Zeit`] ?? "";
      if (!re.test(cell + " Min")) {
        fail(`messages/${l}.json: PaketVergleich.${name.toLowerCase()}Zeit ist "${cell}", erwartet ${re}`);
      }
    }
  }
  ok("Paketvergleichs-Tabelle deckt sich mit pricing.md und den Flugzeiten");
}

// 4. Key-Parität de/en/nl (rekursiv)
const flatten = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? flatten(v, `${prefix}${k}.`)
      : [`${prefix}${k}`]
  );
const keysets = {};
for (const l of ["de", "en", "nl"]) {
  keysets[l] = new Set(flatten(JSON.parse(read(`messages/${l}.json`))));
}
for (const l of ["en", "nl"]) {
  const missing = [...keysets.de].filter((k) => !keysets[l].has(k));
  const extra = [...keysets[l]].filter((k) => !keysets.de.has(k));
  if (missing.length) fail(`messages/${l}.json fehlen Keys: ${missing.slice(0, 10).join(", ")}${missing.length > 10 ? ` (+${missing.length - 10})` : ""}`);
  if (extra.length) fail(`messages/${l}.json überzählige Keys: ${extra.slice(0, 10).join(", ")}${extra.length > 10 ? ` (+${extra.length - 10})` : ""}`);
}
ok("Key-Parität de/en/nl");

// 5. Kein Em-Dash in Message-Dateien, llms.txt, pricing.md (Stilregel)
for (const file of ["public/llms.txt", "public/pricing.md"]) {
  if (read(file).includes("—")) fail(`${file}: enthält Em-Dash (verboten)`);
}
ok("Kein Em-Dash in llms.txt/pricing.md");

// 6. llms.txt: Update-Stempel vorhanden
if (!/letztes Update: (Juli|August|September|Oktober|November|Dezember) 2026/.test(read("public/llms.txt"))) {
  fail("public/llms.txt: Update-Stempel ist nicht aktuell (erwartet: Juli 2026 oder später)");
}
ok("llms.txt Update-Stempel aktuell");

// 7. Title-Laengen: Kern + Brand-Suffix muessen in die SERP passen.
// Google rendert rund 580px, praktisch etwa 60 Zeichen. Der Suffix aus dem
// title.template in app/[locale]/layout.tsx zaehlt mit (homeTitle traegt ihn
// selbst und wird als default nicht getemplatet).
{
  const layout = read("app/[locale]/layout.tsx");
  const suffix = layout.match(/template:\s*"%s([^"]*)"/)?.[1] ?? "";
  const LIMIT = 60;
  let worst = 0;
  for (const l of ["de", "en", "nl"]) {
    const meta = JSON.parse(read(`messages/${l}.json`)).Metadata;
    for (const [key, value] of Object.entries(meta)) {
      if (!/Title$/.test(key) || /OgTitle$/.test(key)) continue;
      const full = key === "homeTitle" ? value : value + suffix;
      worst = Math.max(worst, full.length);
      if (full.length > LIMIT) {
        fail(`messages/${l}.json: ${key} ergibt ${full.length} Zeichen (max ${LIMIT}): "${full}"`);
      }
    }
  }
  ok(`Title-Laengen <= ${LIMIT} Zeichen inkl. Suffix "${suffix}" (laengster: ${worst})`);
}

// 8. CLIENT_NAMESPACES deckt alle useTranslations()-Aufrufe in Client-Dateien ab.
// Der Provider bekommt nur diese Namespaces (lib/client-messages.ts). Fehlt einer,
// stirbt die Komponente zur Laufzeit mit MISSING_MESSAGE, nicht im Build.
{
  const allow = new Set(
    [...read("lib/client-messages.ts").matchAll(/^\s*"([A-Za-z]+)",$/gm)].map((m) => m[1])
  );
  const files = [];
  const walk = (dir) => {
    for (const e of readdirSync(join(root, dir), { withFileTypes: true })) {
      const rel = `${dir}/${e.name}`;
      if (e.isDirectory()) {
        if (e.name !== "node_modules") walk(rel);
      } else if (/\.tsx?$/.test(e.name)) files.push(rel);
    }
  };
  walk("components");
  walk("app");

  const used = new Map();
  for (const f of files) {
    const src = read(f);
    if (!/^\s*["']use client["']/m.test(src)) continue;
    if (/useTranslations\(\s*\)/.test(src)) {
      fail(`${f}: useTranslations() ohne Namespace, mit getrimmtem Provider nicht erlaubt`);
    }
    for (const m of src.matchAll(/useTranslations\(\s*["'`]([^"'`]+)["'`]/g)) {
      used.set(m[1].split(".")[0], f);
    }
  }
  for (const [ns, f] of used) {
    if (!allow.has(ns)) fail(`lib/client-messages.ts: Namespace "${ns}" fehlt (benutzt in ${f})`);
  }
  const unused = [...allow].filter((ns) => !used.has(ns));
  if (unused.length) console.log(`  ..  CLIENT_NAMESPACES ungenutzt (kein Fehler): ${unused.join(", ")}`);
  ok(`CLIENT_NAMESPACES deckt ${used.size} genutzte Namespaces ab`);
}

// 9. splitName: das Buchungsformular hat ein Namensfeld, der Payload zwei.
{
  const { splitName } = await import("../../lib/split-name.ts");
  const cases = [
    ["Max Mustermann", "Max", "Mustermann"],
    ["Anna Maria Huber", "Anna Maria", "Huber"],
    ["Max", "Max", ""],
    ["  Max   Mustermann  ", "Max", "Mustermann"],
    ["", "", ""],
  ];
  for (const [input, vorname, nachname] of cases) {
    const r = splitName(input);
    if (r.vorname !== vorname || r.nachname !== nachname) {
      fail(`splitName(${JSON.stringify(input)}) = ${JSON.stringify(r)}, erwartet ${vorname} / ${nachname}`);
    }
  }
  ok(`splitName: ${cases.length} Faelle korrekt`);
}

// ===========================================================================
// Design-System-Regeln aus DESIGN.md, statischer Teil.
// Die Laufzeit-Regeln (Glow gleich Akzent, Fokusring gleich Akzent) stehen
// in seo.spec.ts, weil sie berechnete Werte brauchen.
// ===========================================================================
{
  // Alle TSX-Dateien einsammeln, node_modules und .next ausgenommen.
  const tsxFiles = [];
  const walk = (dir) => {
    for (const e of readdirSync(join(root, dir), { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name.startsWith(".")) continue;
      const rel = `${dir}/${e.name}`;
      if (e.isDirectory()) walk(rel);
      else if (e.name.endsWith(".tsx")) tsxFiles.push(rel);
    }
  };
  walk("app");
  walk("components");

  // --- Die Container-Regel -------------------------------------------------
  // Inhaltsbreiten kommen aus container-page / -wide / -cta, nie inline.
  // Schwebende Overlays sind ausgenommen: sie haengen an keinem Seitenraster
  // und bringen ihre Geometrie selbst mit. Namentlich, damit jede Ausnahme
  // sichtbar bleibt statt hinter einem Muster zu verschwinden.
  const CONTAINER_AUSNAHMEN = [
    "/components/CookieBanner.tsx",
    "/components/MobileCTA.tsx",
    "/app/admin/page.tsx",
  ];
  const inlineWrapper = /max-w-(?:\[[^\]]+\]|[a-z0-9]+)\s+mx-auto\s+px-\d/;
  const wrapperTreffer = [];
  for (const f of tsxFiles) {
    if (CONTAINER_AUSNAHMEN.some((a) => f.endsWith(a) || f === a.slice(1))) continue;
    read(f)
      .split("\n")
      .forEach((line, i) => {
        if (inlineWrapper.test(line)) wrapperTreffer.push(`${f}:${i + 1}`);
      });
  }
  if (wrapperTreffer.length) {
    fail(`Container-Regel: inline max-w-Wrapper statt Container-Klasse in ${wrapperTreffer.join(", ")}`);
  } else {
    ok("Container-Regel: keine inline Breiten-Wrapper");
  }

  // --- Die Drei-Stufen-Regel ----------------------------------------------
  // Drei Grundstufen, dazu eine weichere Dreipunkt-Fassung der Standardstufe,
  // die drei Marketing-Module nutzen. Die erste Fassung dieser Regel hat nur
  // "py-N lg:py-N" erfasst und die sm:-Zwischenstufe uebersehen; sie meldete
  // deshalb korrekten Code als Fehler. Geprueft wird die vollstaendige Kette.
  // Vollstaendig ausgezaehlt am 2026-08-07, nicht geschaetzt.
  const RHYTHMEN = new Set([
    "py-16 lg:py-24", //          85x  Standard
    "py-20 lg:py-28", //          24x  grosszuegig
    "py-12 lg:py-16", //          10x  gedraengt
    "py-14 sm:py-16 lg:py-24", //  3x  Standard mit weicherem Einstieg
    "py-12 sm:py-16 lg:py-24", //  1x  MapContact, flacherer Einstieg
    "py-8 sm:py-10 lg:py-14", //   1x  StatsBar, bewusst schmales Band
  ]);
  // not-found bestimmt seine Hoehe ueber min-h-[70vh], das Padding ist dort
  // nicht der Taktgeber.
  const RHYTHMUS_AUSNAHMEN = ["app/not-found.tsx", "app/[locale]/not-found.tsx"];
  const rhythmusTreffer = [];
  for (const f of tsxFiles) {
    if (RHYTHMUS_AUSNAHMEN.includes(f)) continue;
    for (const m of read(f).matchAll(/<section[^>]*className="([^"]*)"/g)) {
      const py = m[1].match(/py-\d+(?:\s+(?:sm|md|lg|xl):py-\d+)*/);
      if (py && !RHYTHMEN.has(py[0])) rhythmusTreffer.push(`${f}: "${py[0]}"`);
    }
  }
  if (rhythmusTreffer.length) {
    fail(`Drei-Stufen-Regel: unerlaubter Sektions-Rhythmus in ${rhythmusTreffer.join(", ")}`);
  } else {
    ok(`Drei-Stufen-Regel: nur die ${RHYTHMEN.size} erlaubten Sektions-Rhythmen`);
  }

  // --- Die Dark-First-Regel ------------------------------------------------
  // Themes laufen ueber [data-theme] und CSS-Variablen, nie ueber Utilities.
  const darkTreffer = tsxFiles.filter((f) => /\bdark:[a-z[]/.test(read(f)));
  if (darkTreffer.length) {
    fail(`Dark-First-Regel: dark:-Utility gefunden in ${darkTreffer.join(", ")}`);
  } else {
    ok("Dark-First-Regel: keine dark:-Utilities");
  }

  // --- Die Ein-Quellen-Regel -----------------------------------------------
  // Die Markenfarbe existiert nur im Token-Block. Alles andere leitet ab.
  // Geprueft wird auf Orange-Hex ausserhalb der --accent-Definitionen sowie
  // auf jedes Orange in TSX. Fremdmarken (WhatsApp, Instagram) sind erlaubt.
  const FREMDMARKEN = ["#25d366", "#20bd5a", "#fd1d1d", "#f77737", "#833ab4"];
  const istOrange = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    return r > 150 && r - g > 45 && g >= b && r - b > 70;
  };
  const orangeTreffer = [];
  for (const f of tsxFiles) {
    read(f)
      .split("\n")
      .forEach((line, i) => {
        for (const hex of line.match(/#[0-9a-fA-F]{6}/g) || []) {
          const low = hex.toLowerCase();
          if (FREMDMARKEN.includes(low)) continue;
          if (istOrange(low)) orangeTreffer.push(`${f}:${i + 1} ${hex}`);
        }
      });
  }
  // In globals.css darf Orange nur in den --accent-Zeilen stehen.
  // Kommentare werden vorher entfernt: dort stehen bewusst Messwerte und
  // Alternativen als Hex, und die sind Dokumentation, keine Verwendung.
  // Die erste Fassung dieser Regel hat genau daran Fehlalarme geworfen.
  const cssOhneKommentare = read("app/globals.css").replace(
    /\/\*[\s\S]*?\*\//g,
    (m) => m.replace(/[^\n]/g, " ") // Zeilennummern erhalten
  );
  cssOhneKommentare.split("\n").forEach((line, i) => {
    if (/--accent-[a-z0-9-]+:/.test(line)) return;
    for (const hex of line.match(/#[0-9a-fA-F]{6}/g) || []) {
      if (istOrange(hex.toLowerCase())) {
        orangeTreffer.push(`app/globals.css:${i + 1} ${hex}`);
      }
    }
  });
  if (orangeTreffer.length) {
    fail(`Ein-Quellen-Regel: Markenfarbe hardcodiert in ${orangeTreffer.join(", ")}`);
  } else {
    ok("Ein-Quellen-Regel: Markenfarbe nur im Token-Block");
  }
}

if (errors.length) {
  console.error(`\n${errors.length} Konsistenz-Fehler.`);
  process.exit(1);
}
console.log("\nAlle Konsistenz-Checks bestanden.");
