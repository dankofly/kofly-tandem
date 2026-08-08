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
 * Warum ueber die Netlify-CLI und nicht ueber @netlify/blobs:
 * Das SDK braucht Site-ID UND einen Auth-Token in der Umgebung. Die CLI ist
 * lokal ohnehin angemeldet und bringt beides mit, ohne dass ein Token durch
 * Skripte oder Shell-Historie wandert. In CI funktioniert derselbe Aufruf
 * mit NETLIFY_AUTH_TOKEN.
 *
 * Nutzung:
 *   node ops/blobs-backup.mjs dump    [zielordner]   sichert alle Stores
 *   node ops/blobs-backup.mjs verify  <quellordner>  prueft eine Sicherung
 *   node ops/blobs-backup.mjs restore <quellordner>  spielt sie zurueck
 *
 * WICHTIG: "restore" ueberschreibt. Vorher immer "verify" laufen lassen.
 */
import { exec, execFile } from "child_process";
import { mkdir, readdir, writeFile } from "fs/promises";
import { join } from "path";
import { promisify } from "util";

const run = promisify(execFile);
const runShell = promisify(exec);

/** Die Stores, die die Anwendung tatsaechlich benutzt. */
const STORES = ["images", "chat", "videos", "ticker"];

const IST_WINDOWS = process.platform === "win32";
const NPX = IST_WINDOWS ? "npx.cmd" : "npx";
const AUTH = process.env.NETLIFY_AUTH_TOKEN
  ? ["--auth", process.env.NETLIFY_AUTH_TOKEN]
  : [];

/**
 * Node 25 startet auf Windows keine .cmd-Dateien mehr ohne Shell
 * (spawn EINVAL). Mit shell:true muss dafuer jedes Argument selbst
 * quotiert werden, sonst zerlegt die Shell Schluessel mit Leerzeichen
 * oder Sonderzeichen.
 */
function quote(arg) {
  if (!IST_WINDOWS) return arg;
  return `"${String(arg).replace(/(["\\])/g, "\\$1")}"`;
}

async function netlify(args, opts = {}) {
  const alle = ["--no-install", "netlify", ...args, ...AUTH];
  if (!IST_WINDOWS) {
    return run(NPX, alle, { maxBuffer: 64 * 1024 * 1024, ...opts });
  }
  // Auf Windows als ein Kommandostring ueber die Shell, weil execFile
  // eine .cmd nicht mehr direkt starten darf.
  const kommando = [NPX, ...alle.map(quote)].join(" ");
  return runShell(kommando, { maxBuffer: 64 * 1024 * 1024, ...opts });
}

async function schluessel(store) {
  try {
    const { stdout } = await netlify(["blobs:list", store, "--json"]);
    const daten = JSON.parse(stdout);
    return (daten.blobs ?? []).map((b) => b.key);
  } catch (e) {
    // "store is empty" ist kein Fehler, ein fehlender Login schon.
    if (/is empty/i.test(e.stdout ?? "") || /is empty/i.test(e.message)) return [];
    throw new Error(`blobs:list ${store} fehlgeschlagen: ${e.message}`);
  }
}

async function dump(ziel) {
  const stempel = new Date().toISOString().replace(/[:.]/g, "-");
  const ordner = join(ziel ?? "blob-backups", stempel);

  let gesamt = 0;
  const bericht = [];

  for (const store of STORES) {
    const keys = await schluessel(store);
    if (keys.length) await mkdir(join(ordner, store), { recursive: true });

    for (const key of keys) {
      // Schluessel koennen Schraegstriche enthalten, deshalb kodieren.
      const ziel = join(ordner, store, encodeURIComponent(key));
      await netlify(["blobs:get", store, key, "--output", ziel]);
      gesamt++;
    }
    bericht.push(`  ${store.padEnd(8)} ${String(keys.length).padStart(3)} Schluessel`);
  }

  console.log(bericht.join("\n"));

  if (gesamt === 0) {
    console.error(
      "\nAbbruch: null Objekte gesichert.\n" +
        "Entweder ist die Site wirklich leer, oder der Zugriff scheitert.\n" +
        "Es wird bewusst keine leere Sicherung abgelegt, die spaeter fuer echt gehalten wird."
    );
    process.exit(1);
  }

  // Kleines Manifest, damit verify nicht nur Dateien zaehlt.
  await writeFile(
    join(ordner, "manifest.json"),
    JSON.stringify({ erstellt: new Date().toISOString(), objekte: gesamt, stores: STORES }, null, 2)
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
  for (const store of STORES) {
    try {
      const dateien = await readdir(join(quelle, store));
      console.log(`  ${store.padEnd(8)} ${String(dateien.length).padStart(3)} Dateien`);
      gesamt += dateien.length;
    } catch {
      console.log(`  ${store.padEnd(8)}   0 (nicht in dieser Sicherung)`);
    }
  }
  console.log(`\n${gesamt} Objekte in ${quelle}`);
  if (gesamt === 0) {
    console.error("Diese Sicherung ist leer. Nicht zum Wiederherstellen verwenden.");
    process.exit(1);
  }
  return gesamt;
}

async function restore(quelle) {
  await verify(quelle);

  let gesamt = 0;
  for (const store of STORES) {
    let dateien;
    try {
      dateien = await readdir(join(quelle, store));
    } catch {
      continue;
    }
    for (const datei of dateien) {
      const pfad = join(quelle, store, datei);
      await netlify(["blobs:set", store, decodeURIComponent(datei), "--input", pfad]);
      gesamt++;
    }
    console.log(`  ${store.padEnd(8)} ${dateien.length} Schluessel zurueckgespielt`);
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
          "  node ops/blobs-backup.mjs restore <quellordner>\n\n" +
          "Lokal genuegt eine angemeldete Netlify-CLI. In CI zusaetzlich\n" +
          "NETLIFY_AUTH_TOKEN setzen."
      );
      process.exit(1);
  }
} catch (e) {
  console.error(`\nFehlgeschlagen: ${e.message}`);
  process.exit(1);
}
