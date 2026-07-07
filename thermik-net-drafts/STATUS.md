# thermik.net Revival — Handover / Stand

**Stand:** 2026-07-07. Projekt: thermik.net als Thermik-/Flugwetter-Content-Asset, das die Fortress (gleitschirm-tandemflug.com) mit alten Backlinks stärkt.

## ✅ GEBAUT + LIVE (2026-07-07)
- **Astro-Projekt:** `~/.claude/projects/thermik-net/` (eigenes Git-Repo, `astro build` grün, 7 Seiten). Layout + Hub + Zettersfeld + Hochstein + Tandemflug-Lienz + Flugwetter + Streckenflug + 404-Fallback. Inhalte aus dem echten DB-Dump.
- **Live-Deploy (Netlify):** https://precious-speculoos-3f0576.netlify.app (Site-ID `51dfdedd-29e8-4eb5-886d-848731383796`). Alle Seiten 200.
- **301-Map aktiv:** topische Alt-Slugs → passende Seite (Equity fließt), `/archives/*` + `/permalink/*` etc. → Hub. Bare `/*`-Catch-All greift bei Netlify nicht (Eigenheit `/* → /`); dafür fängt die 404-Seite den seltenen Rest ab und leitet zum Hub.
- **thermik.net als Custom-Domain** auf der Netlify-Site vorbereitet (updateSite). Cert kommt automatisch, sobald DNS zeigt.

### DER EINE OFFENE SCHRITT (Daniel): DNS umstellen
thermik.net liegt aktuell auf dem alten Host (Plesk-301). Um die neue Site live zu schalten: DNS von thermik.net auf die Netlify-Site zeigen (A-Record → 75.2.60.5 bzw. Netlify-DNS). Dann sind alle alten Backlinks unter thermik.net erreichbar und die Fortress profitiert. **Der 301 zum Fortress am alten Host wird dabei ersetzt** (bewusst: die neue Site verlinkt selbst in die Fortress).


## Kern-Entscheidung (Option B)
thermik.net NICHT nur als 301-Redirect, sondern als eigenständige Content-Site wiederbeleben. Informationelle Schicht (Fluggebiete, Flugwetter, Wissen), die kontextuell in die kommerzielle Fortress verlinkt. Tech: **Astro**. Content: **KI-Entwurf + Daniels Fachreview**. Design: **Instrument-/Vario-Look** (freigegeben).

## Wichtige Funde
- **thermik.net = altes WordPress-Blog** (24 Jahre), Backup vorhanden: `C:\Users\DanKof\Downloads\thermik.net__2026-03-26T19_39_42+0100\` mit `sqldump.sql` (5,75 MB, DB-Prefix `thermikdotnet_`).
- **461 veröffentlichte Posts/Pages** extrahiert → `thermik-net-drafts/old-posts-inventory.tsv`. 79 topisch relevant.
- **touchheaven.net ist DANIELS Asset, NICHT Bruno.** Belege: altes thermik.net lag unter `touchheaven.net/httpdocs/`, Inhalte "Club Touch Heaven Lienz", "Landeplatz Touch Heaven Lienz". Vorher fälschlich als Bruno-Domain geführt. → In KNOWLEDGE korrigiert.

## Schon gebaut (Drafts, noch NICHT live)
- `thermik-net-drafts/thermik-am-zettersfeld.md` — Flaggschiff-Guide (faktengeprüft)
- `thermik-net-drafts/hub-startseite.md` — Hub-Konzept
- `thermik-net-drafts/preview-zettersfeld.html` — Einzel-Guide-Vorschau → https://claude.ai/code/artifact/3ff29311-16ed-41ef-8740-2dc2bb59dde8
- `thermik-net-drafts/preview-thermiknet.html` — **komplette SPA-Vorschau** (Hub + 5 Guides, aus echten Alt-Inhalten) → https://claude.ai/code/artifact/4770b7c6-363f-4cea-bcbf-b71aa93b201a
- `thermik-net-drafts/old-posts-inventory.tsv` — vollständige Post-Liste

## 301-/Content-Map (Cluster → neue Seite → Fortress-Link)
| Seite | Fortress-Link | Wichtigste Alt-Slugs |
|---|---|---|
| Zettersfeld | /de/tandemflug-zettersfeld | gleitschirmfliegen-am-zettersfeld-...-fluggebiets-info, fluggebiets-info-lienz, soaring-am-zettersfeld, 1500-e-fur-ein-220km-fai-vom-zettersfeld, epicsoaring-zettersfeld-video, erste-fruhjahrsthermik-zettersfeld, hike-biwak-fly-paragleiten-zettersfeld |
| Hochstein | /de/tandemflug-hochstein | xc-startplatz-hochstein-kein-geheimtipp-mehr, proximity-speedlfying-am-hochstein-h2000, hochstein-freestyle-session-abgesagt |
| Tandemflug/Flugtaxi Lienz | /de/tandemflug-lienz | flugtaxi-airtaxi-gleitschirm-tandemflug-in-lienz, gleitschirm-tandemflug-lienz, airtaxi-osttirol-gleitschirm-tandemfluge, tandemfluge-lienz, tandem-sessions, tandemflug-in-lienz-videos, faszination-gleitschirm-tandemfliegen, tandem-lienz-vom-zettersfeld, abenteuer-tandemfliegen-lienz-zettersfeld-osttirol |
| Flugwetter & Thermik | /de/thermikflug | flugwetter, flugwetter-2, flugwetter-wetterkunde-und-meteorlogische-vorbereitung, thermik-magazine(-zeitschrift...) |
| Streckenflug / Fliegen in Lienz | /de/tandemflug-osttirol | streckenfliegen-mit-dem-gleitschirm-in-lienz, gleitschirm-fliegen-in-lienz-osttirol, walk-and-fly-in-osttirol |
| Historie/Szene (Events) | Hub | osttirol-open-*, dolomitenmann-*, dolomiten-open-*, redbull-x-alps, paragliding-world-cup-* → topischer 301 |

## Offene FACHCHECKs (Daniel)
- **Zettersfeld-Ausrichtung:** Daniels alte "Fluggebiets Info Lienz" sagt **zwei Startplätze, ostseitig (Sommer) / westseitig (Winter)** neben dem Sesselliftausstieg. Das ist präziser als der Live-Fix "nach Südwesten". → Prüfen, ob die LIVE-Fortress-Seiten (Zettersfeld + Lienz, de/en/nl) von "südwestseitig" auf "ost-/westseitig" geändert werden sollen. (Der frühere "Nordhang" war definitiv falsch und ist bereits behoben.)
- **Hochstein-Höhe:** ENTSCHIEDEN 2026-07-07. Fortress bleibt bei **2.000 m** (Marketing-Zahl), der widersprüchliche 2.057-m-Wert wurde überall bereinigt (de/en/nl, llms.txt, MapContact). thermik.net nutzt bewusst die touchheaven-Fachzahl **1.920 m**. Zwei Zahlen, zwei Seiten, mit Absicht.
- **Zettersfeld-Höhe:** Fortress durchgängig **2.220 m** (verirrte 2.214-m-Reste in ablaufDescription + llms.txt auf 2.220 vereinheitlicht). thermik.net = touchheaven **2.195 m**.
- **220-km-FAI vom Zettersfeld:** Jahr/Pilot ergänzen.
- **thermik.net "seit wann":** genaues Gründungsjahr für die Hub-Startseite.

## Nächste Schritte thermik.net
1. Astro-Projekt scaffolden (eigenes Repo + Working-Dir + Vault-Ordner, wie Pro3).
2. Restliche Guides aus echten Dump-Inhalten fertig schreiben (Content pro Slug via Parser extrahierbar).
3. 301-Map als `_redirects` / Astro-Config anlegen (alle Alt-Slugs → neue Seiten, Rest topisch auf Hub).
4. DNS thermik.net vom aktuellen 301 auf die neue Astro-Site umstellen — ERST wenn Content live.

## Parallel offene Threads (aus der Session, nicht thermik.net)
- **airpark-lienzerdolomiten.com:** DNS auf Netlify (75.2.60.5) gesetzt, Alias dort eingetragen. Cert fehlt noch → in Netlify "Renew certificate" klicken (oder auto in ~1h). Dann https + 301 auf /de fertig.
- **kofly.at:** live + 301 auf /de funktioniert. Cleanup: alte united-domains-Weiterleitung deaktivieren.
- **GSC:** für /de/tandemflug-zettersfeld und /de/tandemflug-hochstein "Indexierung beantragen" (UI). Sitemap wurde neu angepingt.
- **GSC-Recheck terminiert ~20. Juli 2026** (Vorher-Nachher, neue Seiten indexiert).
- **Off-site-Hebel:** Review-Velocity (Map Pack), Qualitäts-Backlinks (TVB, Bergfex, Outdooractive, Komoot).
- **Exakte Backlink-Priorisierung:** Ahrefs/Semrush verbinden oder GSC-Links-Report-Screenshot.
- **TPC-Namensnutzung** ("Daniel Kofler" auf tandem-paragliding.center): Anwaltsfrage, nach Direktkanal-Aufbau.

## Live heute deployed (Fortress)
Zettersfeld-Seite, Hochstein-Seite, Product-Schema auf 4 Landingpages, ueber-uns Anti-Vermittler/Team-Block, llms.txt-Härtung, Zettersfeld-Ausrichtung-Fix (Nord→Südwest), Höhen-Vereinheitlichung. Alle Commits auf main, Netlify auto-deployed.
