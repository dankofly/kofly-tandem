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
 * SICHERHEITSHINWEIS ZUR BAUFORM (2026-08-08):
 * Eine frueher Fassung dieses Skripts rief die Netlify-CLI ueber eine Shell
 * auf und setzte den Befehl als String zusammen. Blob-Schluessel stammen
 * aber aus formData (app/api/admin/images/route.ts nimmt "slot" entgegen
 * und schreibt daraus den Schluessel). Ein Schluessel mit Metazeichen haette
 * beim Sichern beliebige Befehle auf dem ausfuehrenden Rechner gestartet.
 * Besseres Quotieren waere die falsche Antwort gewesen: cmd.exe laesst sich
 * mit Backslash-Escaping nicht zuverlaessig absichern.
 *
 * Deshalb laeuft hier jetzt KEIN Unterprozess mehr. Reines Node ueber
 * @netlify/blobs. Kein Shell-Aufruf, keine Kommandozusammensetzung, damit
 * auch keine Injektionsflaeche. Schluessel sind wieder das, was sie sein
 * sollten: Daten.
 *
 * Zugangsdaten, in dieser Reihenfolge:
 *   1. NETLIFY_AUTH_TOKEN und NETLIFY_SITE_ID (bzw. SITE_ID) aus der Umgebung
 *   2. .netlify/state.json fuer die Site-ID
 *   3. die angemeldete Netlify-CLI, deren Token im Benutzerprofil liegt
 * Der Token wird nie ausgegeben und nie in eine Datei geschrieben.
 *
 * Nutzung:
 *   node ops/blobs-backup.mjs dump    [zielordner]
 *   node ops/blobs-backup.mjs verify  <quellordner>
 *   node ops/blobs-backup.mjs restore <quellordner>
 *
 * WICHTIG: "restore" ueberschreibt. Vorher immer "verify" laufen lassen.
 */
import { getStore } from "@netlify/blobs";
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import { homedir } from "os";
import { join } from "path";

/** Die Stores, die die Anwendung tatsaechlich benutzt. */
const STORES = ["images", "chat", "videos", "ticker"];

async function jsonOderNull(pfad) {
  try {
    return JSON.parse(await readFile(pfad, "utf-8"));
  } catch {
    return null;
  }
}

async function siteId() {
  const ausUmgebung = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  if (ausUmgebung) return ausUmgebung;
  const state = await jsonOderNull(join(process.cwd(), ".netlify", "state.json"));
  return state?.siteId ?? null;
}

async function authToken() {
  if (process.env.NETLIFY_AUTH_TOKEN) return process.env.NETLIFY_AUTH_TOKEN;

  // Ablageort der angemeldeten CLI, je nach Plattform.
  const kandidaten = [
    process.env.APPDATA && join(process.env.APPDATA, "netlify", "Config", "config.json"),
    join(homedir(), "AppData", "Roaming", "netlify", "Config", "config.json"),
    join(homedir(), ".config", "netlify", "config.json"),
    join(homedir(), "Library", "Preferences", "netlify", "config.json"),
  ].filter(Boolean);

  for (const pfad of kandidaten) {
    const cfg = await jsonOderNull(pfad);
    const nutzer = cfg?.users ?? {};
    for (const eintrag of Object.values(nutzer)) {
      const t = eintrag?.auth?.token;
      if (t) return t;
    }
  }
  return null;
}

async function verbindung() {
  const [id, token] = await Promise.all([siteId(), authToken()]);
  if (!id || !token) {
    console.error(
      "Abbruch: Zugangsdaten unvollstaendig.\n" +
        `  Site-ID: ${id ? "gefunden" : "FEHLT"}\n` +
        `  Token:   ${token ? "gefunden" : "FEHLT"}\n\n` +
        "Entweder NETLIFY_SITE_ID und NETLIFY_AUTH_TOKEN setzen, oder lokal\n" +
        "einmal 'npx netlify login' ausfuehren. Es wird bewusst keine leere\n" +
        "Sicherung geschrieben, die spaeter fuer echt gehalten wird."
    );
    process.exit(1);
  }
  return (name) => getStore({ name, siteID: id, token, consistency: "strong" });
}

async function dump(ziel) {
  const store = await verbindung();
  const stempel = new Date().toISOString().replace(/[:.]/g, "-");
  const ordner = join(ziel ?? "blob-backups", stempel);

  let gesamt = 0;
  for (const name of STORES) {
    const { blobs } = await store(name).list();
    if (blobs.length) await mkdir(join(ordner, name), { recursive: true });

    for (const { key } of blobs) {
      const daten = await store(name).get(key, { type: "arrayBuffer" });
      if (daten === null) continue;
      // Schluessel koennen Schraegstriche und Sonderzeichen enthalten.
      // encodeURIComponent macht daraus einen unbedenklichen Dateinamen.
      await writeFile(join(ordner, name, encodeURIComponent(key)), Buffer.from(daten));
      gesamt++;
    }
    console.log(`  ${name.padEnd(8)} ${String(blobs.length).padStart(3)} Schluessel`);
  }

  if (gesamt === 0) {
    console.error(
      "\nAbbruch: null Objekte gesichert. Entweder ist die Site wirklich leer,\n" +
        "oder der Zugriff scheitert still. Es wird keine leere Sicherung abgelegt."
    );
    process.exit(1);
  }

  await mkdir(ordner, { recursive: true });
  await writeFile(
    join(ordner, "manifest.json"),
    JSON.stringify(
      { erstellt: new Date().toISOString(), objekte: gesamt, stores: STORES },
      null,
      2
    )
  );

  console.log(`\n${gesamt} Objekte gesichert nach ${ordner}`);
  return ordner;
}

async function verify(quelle) {
  if (!quelle) {
    console.error("Abbruch: Quellordner fehlt.");
    process.exit(1);
  }
  let gesamt = 0;
  let leere = 0;
  for (const name of STORES) {
    let dateien;
    try {
      dateien = await readdir(join(quelle, name), { withFileTypes: true });
    } catch {
      console.log(`  ${name.padEnd(8)}   0 (nicht in dieser Sicherung)`);
      continue;
    }
    for (const d of dateien) {
      if (!d.isFile()) continue;
      const inhalt = await readFile(join(quelle, name, d.name));
      if (inhalt.length === 0) leere++;
      gesamt++;
    }
    console.log(`  ${name.padEnd(8)} ${String(dateien.length).padStart(3)} Dateien`);
  }
  console.log(`\n${gesamt} Objekte in ${quelle}, davon ${leere} leer`);
  if (gesamt === 0) {
    console.error("Diese Sicherung ist leer. Nicht zum Wiederherstellen verwenden.");
    process.exit(1);
  }
  if (leere > 0) {
    console.error(`${leere} leere Datei(en). Die Sicherung ist unvollstaendig.`);
    process.exit(1);
  }
  return gesamt;
}

async function restore(quelle) {
  await verify(quelle);
  const store = await verbindung();

  let gesamt = 0;
  for (const name of STORES) {
    let dateien;
    try {
      dateien = await readdir(join(quelle, name));
    } catch {
      continue;
    }
    for (const datei of dateien) {
      const daten = await readFile(join(quelle, name, datei));
      await store(name).set(decodeURIComponent(datei), daten);
      gesamt++;
    }
    console.log(`  ${name.padEnd(8)} ${dateien.length} Schluessel zurueckgespielt`);
  }
  console.log(`\n${gesamt} Objekte wiederhergestellt aus ${quelle}`);
}

const [, , befehl, arg] = process.argv;
try {
  switch (befehl) {
    case "dump":
      await dump(arg);
      break;
    case "verify":
      await verify(arg);
      break;
    case "restore":
      await restore(arg);
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
} catch (e) {
  // Fehlermeldung bewusst ohne Objekt-Dump, damit kein Token im Log landet.
  console.error(`\nFehlgeschlagen: ${e.message}`);
  process.exit(1);
}
