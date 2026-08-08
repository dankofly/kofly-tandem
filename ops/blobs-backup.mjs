#!/usr/bin/env node
/**
 * Sicherung und Wiederherstellung des einzigen Zustandsspeichers.
 *
 * Warum das existiert: Der gesamte veraenderbare Zustand der Site liegt in
 * Netlify Blobs (Bild-Konfiguration und hochgeladene Bilder, Chat-Prompt,
 * Video-Slots, Ticker). Es gab dafuer weder eine Sicherung noch einen
 * erprobten Wiederherstellungsweg. Ein versehentliches Loeschen im
 * Netlify-UI oder ein fehlerhafter Schreibvorgang waere unumkehrbar
 * gewesen, und das faellt erst auf, wenn die Seite falsche Bilder zeigt.
 *
 * Nutzung:
 *   node ops/blobs-backup.mjs dump    [zielordner]   sichert alle Stores
 *   node ops/blobs-backup.mjs restore <quellordner>  spielt sie zurueck
 *   node ops/blobs-backup.mjs verify  <quellordner>  prueft eine Sicherung
 *
 * Voraussetzung: NETLIFY_SITE_ID und NETLIFY_AUTH_TOKEN in der Umgebung,
 * oder Ausfuehrung ueber "netlify dev:exec". Ohne beides bricht das Skript
 * ab, statt eine leere Sicherung zu schreiben, die spaeter fuer echt
 * gehalten wird.
 *
 * WICHTIG: "restore" ueberschreibt. Vorher immer "verify" laufen lassen.
 */
import { getStore } from "@netlify/blobs";
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

/** Die Stores, die die Anwendung tatsaechlich benutzt. */
const STORES = [
  { name: "images", keys: null }, // null = alle Schluessel auflisten
  { name: "chat", keys: null },
  { name: "videos", keys: null },
  { name: "ticker", keys: null },
];

function pruefeUmgebung() {
  const fehlt = ["NETLIFY_SITE_ID", "NETLIFY_AUTH_TOKEN"].filter(
    (k) => !process.env[k]
  );
  if (fehlt.length) {
    console.error(
      `Abbruch: ${fehlt.join(" und ")} fehlt/fehlen.\n` +
        `Ohne Zugangsdaten kann dieses Skript nicht auf die Blobs zugreifen und\n` +
        `wuerde sonst eine leere Sicherung schreiben.\n\n` +
        `Entweder setzen, oder das Skript ueber "netlify dev:exec" starten:\n` +
        `  npx netlify dev:exec node ops/blobs-backup.mjs dump`
    );
    process.exit(1);
  }
}

async function dump(ziel) {
  pruefeUmgebung();
  const stempel = new Date().toISOString().replace(/[:.]/g, "-");
  const ordner = join(ziel ?? "blob-backups", stempel);
  await mkdir(ordner, { recursive: true });

  let gesamt = 0;
  for (const { name } of STORES) {
    const store = getStore({ name, consistency: "strong" });
    const { blobs } = await store.list();
    const storeOrdner = join(ordner, name);
    await mkdir(storeOrdner, { recursive: true });

    for (const { key } of blobs) {
      const daten = await store.get(key, { type: "arrayBuffer" });
      if (daten === null) continue;
      // Schluessel koennen Schraegstriche enthalten, deshalb kodieren.
      await writeFile(join(storeOrdner, encodeURIComponent(key)), Buffer.from(daten));
      gesamt++;
    }
    console.log(`  ${name.padEnd(8)} ${blobs.length} Schluessel`);
  }

  console.log(`\n${gesamt} Objekte gesichert nach ${ordner}`);
  if (gesamt === 0) {
    console.error(
      "WARNUNG: Null Objekte. Das ist fast sicher ein Zugriffsproblem und keine leere Site."
    );
    process.exit(1);
  }
  return ordner;
}

async function verify(quelle) {
  let gesamt = 0;
  for (const { name } of STORES) {
    try {
      const dateien = await readdir(join(quelle, name));
      console.log(`  ${name.padEnd(8)} ${dateien.length} Dateien`);
      gesamt += dateien.length;
    } catch {
      console.log(`  ${name.padEnd(8)} fehlt in dieser Sicherung`);
    }
  }
  console.log(`\n${gesamt} Objekte in ${quelle}`);
  if (gesamt === 0) {
    console.error("Diese Sicherung ist leer. Nicht zum Wiederherstellen verwenden.");
    process.exit(1);
  }
}

async function restore(quelle) {
  pruefeUmgebung();
  if (!quelle) {
    console.error("Abbruch: Quellordner fehlt.");
    process.exit(1);
  }
  await verify(quelle);

  let gesamt = 0;
  for (const { name } of STORES) {
    let dateien;
    try {
      dateien = await readdir(join(quelle, name));
    } catch {
      continue;
    }
    const store = getStore({ name, consistency: "strong" });
    for (const datei of dateien) {
      const daten = await readFile(join(quelle, name, datei));
      await store.set(decodeURIComponent(datei), daten);
      gesamt++;
    }
    console.log(`  ${name.padEnd(8)} ${dateien.length} Schluessel zurueckgespielt`);
  }
  console.log(`\n${gesamt} Objekte wiederhergestellt aus ${quelle}`);
}

const [, , befehl, arg] = process.argv;
switch (befehl) {
  case "dump":
    await dump(arg);
    break;
  case "restore":
    await restore(arg);
    break;
  case "verify":
    await verify(arg ?? ".");
    break;
  default:
    console.log(
      "Verwendung:\n" +
        "  node ops/blobs-backup.mjs dump    [zielordner]\n" +
        "  node ops/blobs-backup.mjs verify  <quellordner>\n" +
        "  node ops/blobs-backup.mjs restore <quellordner>"
    );
    process.exit(1);
}
