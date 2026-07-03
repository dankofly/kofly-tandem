# thermik.net Path-Aware-Migration — Deploy-Anleitung

**Stand:** 2026-05-11
**Ziel:** GSC-Umleitungsfehler (36 URLs) beseitigen + SEO-optimaler Equity-Transfer

## Was wird geändert

Die aktuelle `.htaccess` auf NBGO Plesk macht einen **Path-Strip-Catch-All-301** auf `/de`. Google flaggt das als Soft-404 für alle Pages die nicht topisch zur Tandem-Homepage passen → 36 Umleitungsfehler in GSC.

**Neue Strategie (siehe `.htaccess`):**
- **5 Root-Variants** → 301 → `/de` (Domain-Equity-Transfer)
- **4 topisch-äquivalente Pages** → 301 → spezifische Tandem-Pages
- **Alle anderen Pfade** → 410 Gone (sauberes Signal, keine Index-Vermüllung)
- **dev.thermik.net** komplett → 410 Gone

## Deploy — 3 Optionen

### Option A: Plesk File Manager (einfachste)

1. Login: `https://hosting01.nbgo.de:8443` (Plesk-URL — Username/Passwort aus deinen Notizen)
2. Domain `thermik.net` öffnen → **Files** → `/httpdocs/`
3. `.htaccess` öffnen (Edit-Button)
4. Inhalt von `ops/thermik-migration/.htaccess` (dieser Repo) **komplett ersetzen**
5. Save

### Option B: SFTP (wenn FTP-Credentials parat)

```bash
# Aus diesem Repo:
sftp user@hosting01.nbgo.de   # oder spezifischer Host aus Plesk
> cd httpdocs
> put ops/thermik-migration/.htaccess
> bye
```

### Option C: Plesk CLI / Plesk-API (falls SSH zum Plesk-Server vorhanden)

Eher unwahrscheinlich auf Shared-Hosting. Skip.

## Verifikation (NACH Deploy zwingend)

Aus diesem Repo:
```bash
bash ops/thermik-migration/verify.sh
```

Testet 24 Pattern-Klassen mit `Googlebot`-User-Agent. Erwartet: **0 failed**.

Manuell für eine einzelne URL:
```bash
curl -sI -A "Googlebot" "https://thermik.net/archives/2201-spitfire-2-test.html"
# Erwartet: HTTP/1.1 410 Gone
```

## Nach erfolgreichem Deploy

1. **GSC → Search Console** für Property `sc-domain:thermik.net`:
   - Indexierung → Seiten → "Umleitungsfehler" → **Validierung starten**
   - Validation läuft 2-4 Wochen, Errors verschwinden schrittweise

2. **NICHT** Change-of-Address-Tool nutzen.
   Grund: CoA erwartet 1:1-Page-Mapping. Wir haben Mixed-Strategie (Root + 4 Maps + 410-Rest). CoA würde verwirrte Signale erzeugen. Google verarbeitet die 301s und 410s automatisch korrekt.

3. **Backlink-Cleanup-Bonus** (optional, später):
   - Hauptsächliche Refer-Domains laut `Tandemflug/ACCESS.md`: cybo.com, hotfrog.at, topblogs.de, gleitschirmdrachenforum.de, webwiki.com
   - Falls möglich: bei einigen davon Link direkt auf gleitschirm-tandemflug.com aktualisieren lassen (umgeht den Redirect → 100% Equity-Transfer)

4. **GSC-Errors die NICHT durch diese Migration gefixt werden:**
   - **3× "Wegen Zugriffsverbot (403) blockiert"** — getrennte Analyse nötig, vermutlich Plesk-Auth-Schutz oder robots-Block. Nach Deploy einzeln durchgehen.
   - **1× "Gecrawlt – zurzeit nicht indexiert"** — Content-Quality-Issue, kein technischer Fix. Lässt sich nur über Content-Wertsteigerung beheben (oder ignorieren).

## Rollback

Falls die neue `.htaccess` was kaputt macht:
1. Plesk File Manager → `.htaccess` öffnen
2. Komplett ersetzen mit alten Catch-All (im `_LOG.md` der Tandemflug-Vault dokumentiert):
   ```apache
   RewriteEngine On
   RewriteRule .* https://gleitschirm-tandemflug.com/de [R=301,L]
   ```
3. WP-Toolkit-Backup vom 2026-05-08 ist verfügbar für Worst-Case.

## Wichtig — Was wir damit NICHT erreichen

Ehrlich gesagt: Dieser Fix ist SEO-optimal **gegeben unsere Constraints**, aber nicht magisch. Realistische Erwartung:

- ✓ 36 GSC-Umleitungsfehler verschwinden in 2-4 Wochen
- ✓ Domain-Authority von thermik.net (24 Jahre) wird auf gleitschirm-tandemflug.com Root transferiert
- ✗ Wir gewinnen NICHT plötzlich Rankings für Speedflying/Spitfire/Wettkampf-Keywords. Die Backlinks zu diesen Pages werden mit 410 entwertet — aber das war ohnehin kein realisierbarer Equity weil keine äquivalente Page existiert.
- ✗ Wir gewinnen NICHT signifikante Tandem-Rankings nur durch diese Migration. Hauptwirkung: Domain-Equity-Transfer auf Root + Indexsignal-Hygiene.

Real-World Impact-Schätzung: kleiner Boost auf gleitschirm-tandemflug.com Domain-Authority-Score (Ahrefs DR ggf. +1 bis +3), keine garantierten Keyword-Movements.
