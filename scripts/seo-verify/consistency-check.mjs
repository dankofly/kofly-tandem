/**
 * Statischer Konsistenz-Check (kein Server nötig): npm run verify:consistency
 *
 * Prüft, dass Review-Zahlen, Gutschein-Gültigkeit und Flugzeiten in
 * messages/, public/llms.txt und public/pricing.md nicht auseinanderlaufen
 * und dass die Message-Dateien strukturgleich sind (Key-Parität).
 */
import { readFileSync } from "fs";
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

if (errors.length) {
  console.error(`\n${errors.length} Konsistenz-Fehler.`);
  process.exit(1);
}
console.log("\nAlle Konsistenz-Checks bestanden.");
