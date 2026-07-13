# ops/gsc - Google Search Console Ops

## request-indexing.mjs

Beantragt "Indexierung" fuer eine Liste von URLs ueber die GSC-Web-UI. Nötig,
weil die GSC-API das nicht kann (nur Sitemap-Einreichung und URL-Inspektion).

```bash
# Standard-URLs (die Money-Pages, die Google noch nicht gecrawlt hat)
node ops/gsc/request-indexing.mjs

# Eigene URLs
node ops/gsc/request-indexing.mjs https://gleitschirm-tandemflug.com/de/tandemflug-hochstein
```

**Voraussetzungen:**
- `playwright` und der Chrome-Channel sind im Projekt installiert.
- Erster Lauf: Chrome oeffnet sich, mit `danielkofler@gmail.com` in der GSC
  einloggen. Login wird im Profil `~/.claude/browser-profiles/google-daniel`
  gecacht, danach laeuft es ohne Interaktion.

**Grenzen:**
- Google-Tageskontingent fuer "Indexierung beantragen": ca. 10-12 URLs pro
  Property und Tag. Bei mehr URLs auf mehrere Tage verteilen.
- "Indexierung beantragt" heisst: URL kommt in eine bevorzugte Crawling-
  Warteschlange. Es ist keine Garantie und keine Sofort-Indexierung; der Crawl
  passiert typischerweise in den folgenden Tagen.
- Screenshots je URL landen in `ops/gsc/shots/` (gitignored).

## Kontext

Am 2026-07-13 waren 5 Money-Pages "URL is unknown to Google", weil sie intern
verwaist waren (Footer-Fix in PR #18 behebt das) und die Sitemap veraltete
lastmod-Daten trug (neu eingereicht). Dieses Script hat die 5 URLs manuell in
die Crawling-Warteschlange geschoben, um den ersten Crawl zu beschleunigen.
