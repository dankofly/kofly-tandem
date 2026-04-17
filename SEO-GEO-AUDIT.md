# SEO, GEO & Technik-Audit – Gleitschirm-Tandemflug.com

**Datum:** 17. April 2026
**Domain:** https://gleitschirm-tandemflug.com
**Hosting:** Netlify (Next.js 15, SSG/SSR)
**Status:** Neue Next.js-Seite ist **LIVE** (ersetzt WordPress)

---

## 1. EXECUTIVE SUMMARY

| Bereich | Status | Score |
|---------|--------|-------|
| On-Page SEO (Meta, H1, Canonical, hreflang) | Exzellent | 9,5 / 10 |
| Schema / JSON-LD | Exzellent | 9,5 / 10 |
| GEO (AI-Suchmaschinen) | Exzellent | 9,5 / 10 |
| Technisch (Headers, Security, HTTPS) | Sehr gut | 9,0 / 10 |
| Performance (TTFB, Größe) | Gut | 8,0 / 10 |
| Sitemap / robots.txt | Sehr gut | 9,0 / 10 |
| Content & E-E-A-T (llms.txt) | Exzellent | 10 / 10 |

**Gesamtnote: 9,2 / 10** – deutlich über Branchenschnitt. 8 konkrete Optimierungen unten.

---

## 2. ON-PAGE SEO – LIVE-CHECK

### 2.1 Homepage `/de` – OK

| Element | Wert | Bewertung |
|---------|------|-----------|
| `<title>` | `Tandemflug Lienz – Paragleiten Osttirol ab €150 \| KOFLY` | OK (58 Zeichen) |
| `<meta description>` | `Tandemflug Lienz ab €150 – Paragliding Osttirol mit zertifizierten Piloten. 5,0 Sterne (284 Bewertungen). Nr. 1 Outdoor-Aktivität Lienzer Dolomiten.` | OK (150 Zeichen) |
| Canonical | `https://gleitschirm-tandemflug.com/de` | OK |
| Hreflang | DE, EN, NL, x-default | OK |
| OG-Tags | Komplett (title, description, url, image 1200×630, locale de_AT) | OK |
| Twitter Cards | summary_large_image | OK |
| H1-Count | **1** | OK (war 14 in WP – jetzt korrekt) |
| Robots | `index, follow` | OK |
| Geo-Meta | AT-7, Lienz, 46.8298;12.7693 | OK |

### 2.2 Sprachversionen

- [/en](https://gleitschirm-tandemflug.com/en) → `Tandem Paragliding Lienz – East Tyrol from €150 | KOFLY` – OK
- [/nl](https://gleitschirm-tandemflug.com/nl) → `Tandemvlucht Lienz - Paragliden in Oost-Tirol | KOFLY` – OK
- Canonical korrekt pro Locale, hreflang-Self-Reference überall vorhanden.

### 2.3 Unterseiten – Stichprobe `/de/ablauf`

Title, Canonical, hreflang OK. Schema-Count: nur 2 JSON-LD auf Unterseiten (vs. 9 auf Home). Gut strukturiert – kein Schema-Spam auf Legal-/Detailseiten.

---

## 3. SCHEMA / JSON-LD – LIVE

**Homepage hat 9 JSON-LD-Skripte** mit folgenden `@type`-Entities:

| Schema | Entity | Rich-Result-fähig |
|--------|--------|-------------------|
| Organization + LocalBusiness + SportsActivityLocation | ✓ | Knowledge Panel |
| Service + OfferCatalog (5 Pakete) | ✓ | Rich Snippet |
| Service (Voucher, Gutschein) | ✓ | – |
| WebSite + Publisher | ✓ | Sitelinks-Search |
| Product + AggregateOffer | ✓ | Sterne + Preisrange |
| TouristAttraction | ✓ | – |
| ItemList (Site-Navigation, 9 Elemente) | ✓ | – |
| Person (Daniel Kofler) | ✓ | Knowledge Panel |
| FAQPage (31 Q&A, nur Homepage) | ✓ | FAQ Rich Snippets |

**AggregateRating:** 5,0 / 5 aus **284 Bewertungen** (war vorher 250) + 4 Einzel-Reviews.

**Verbesserungspotential:**
- 9 separate `<script>`-Tags → könnten zu einem `@graph` verdichtet werden (spart ~2 KB, minimal).
- Alle 4 Reviews haben `author.name: "Tripadvisor-Gast"` → Google könnte das als unspezifisch einstufen. Vornamen/Initialen diversifizieren.
- `SearchAction` im `WebSite`-Schema fehlt aktuell (letztes Audit: Target zeigte auf `/buchen?q=` → korrekt entfernt bzw. nicht implementiert – OK, aber falls Sitelinks-Search gewünscht, sauberer Endpoint nötig).

---

## 4. TECHNIK – HTTP-HEADERS & SECURITY

### 4.1 Security-Headers (ausgezeichnet)

| Header | Wert | Bewertung |
|--------|------|-----------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Preload-ready |
| `X-Content-Type-Options` | `nosniff` | OK |
| `X-Frame-Options` | `DENY` | OK |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | OK |
| `Cross-Origin-Opener-Policy` | `same-origin` | OK |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), notifications=()` | OK |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; ...` | **Verbesserbar** |

**Problem:** CSP erlaubt `'unsafe-inline'` + `'unsafe-eval'` für `script-src`. Next.js benötigt das für Hydration, aber mittels **Nonce-basiertem CSP** könnte `'unsafe-inline'` entfernt werden. Priorität: MITTEL.

### 4.2 Cache-Control auf HTML

```
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
```

**Problem:** HTML-Responses werden **nicht gecacht**. Bei statischen, locale-basierten Seiten ist das Overhead – jedes Request landet am Origin. Netlify Edge-Cache kann nicht helfen.

**Empfehlung:** `middleware.ts` prüfen, ggf. `Cache-Control: public, max-age=0, s-maxage=3600, stale-while-revalidate=86400` für prerendered HTML setzen. Priorität: HOCH (Performance + SEO-Crawling).

### 4.3 Performance (Curl-Messung)

| Metrik | Wert |
|--------|------|
| TTFB | 479 ms |
| Total Load | 559 ms |
| HTML-Größe (unkomprimiert) | 447 KB |
| HTML-Größe (brotli/gzip) | 138 KB |
| HTTP-Version | HTTP/1.1 (curl) – Browser nutzen HTTP/2 via Netlify |

Empfehlung: PageSpeed Insights / Lighthouse auf Live-URL prüfen (LCP, CLS, INP).

---

## 5. ROBOTS.TXT & SITEMAP

### 5.1 robots.txt – vollständig

Alle relevanten AI-Bots explizit erlaubt: GPTBot, ChatGPT-User, OAI-SearchBot, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, Applebot, CCBot, FacebookBot, Bytespider, Brave. Sitemap-Verweis korrekt.

### 5.2 Sitemap.xml

| Check | Wert |
|-------|------|
| URL-Count | **30** (3 Sprachen × 10 Seiten) |
| Hreflang-Alternates | Ja (de/en/nl/x-default pro URL) |
| Priorität | 1,0 Home → 0,3 Legal (gestaffelt) |
| changeFrequency | weekly/monthly/yearly sinnvoll vergeben |
| **lastmod** | `2026-03-02T07:04:43Z` (letzter Build) |

**Problem:** `lastmod = new Date()` bei jedem Build, identisch für alle URLs. Letzter Build war vor 6 Wochen – heute 2026-04-17. Zwei Optionen:
- **A)** Rebuild/Redeploy → lastmod springt auf aktuelles Datum (verwirrt Google, wenn nichts geändert wurde)
- **B)** Echte `lastmod` pro Seite aus Git-Commit oder CMS-Feld ableiten (empfohlen für Content-reiche Seiten).

Priorität: MITTEL.

---

## 6. GEO (AI-Suchmaschinen)

### 6.1 AI-Bot-Zugriff

Vollständig erlaubt via `robots.txt` (siehe 5.1). Keine Sperren.

### 6.2 llms.txt – vorbildlich

Umfangreiche `llms.txt` mit:
- Wichtige Landing-Seiten
- E-E-A-T-Säulen (Daniel Kofler, KOFLY-Historie)
- Marken-Entitäten
- Autoritätsbelege (5,0 / 284 Reviews)

→ **Das ist weit über Branchenschnitt.** Wenig Optimierungsbedarf.

### 6.3 GEO-Content-Signale (Princeton-Methoden)

| Methode | Boost | Status |
|---------|-------|--------|
| Statistiken | +37 % | ✓ FAQ: „5,0 / 284 Bewertungen", „ab €150", „10.000+ Flüge" |
| Autoritative Sprache | +25 % | ✓ „führender Anbieter", „Nr. 1 Outdoor-Aktivität" |
| Quellen-Zitate | +40 % | ✓ Tripadvisor, Google, osttirol-heute.at |
| Technische Begriffe | +18 % | ✓ Thermik, Zettersfeld, Hochstein, Airpark |
| Flüssiger Text | +15-30 % | ✓ FAQ-Antworten strukturiert |
| Keyword-Stuffing | **-10 %** | **Warnung → siehe 7.3** |

---

## 7. KRITISCHE FINDINGS (Priorisiert)

### HOCH

**1. Meta-Keywords-Overload (44 Keywords)**
Das `<meta name="keywords">`-Tag enthält 44 Keywords. Google ignoriert es zwar, **Bing und Yandex werten es teilweise aus** und können Keyword-Stuffing negativ bewerten. Reduziere auf 8–12 Kern-Keywords.
**File:** [messages/de.json](messages/de.json) → `Metadata.homeKeywords`.

**2. Cache-Control HTML auf `no-store`**
Netlify Edge kann keine HTML-Responses zwischenspeichern. Erwartet: Edge-Cache mit `stale-while-revalidate`. Overhead pro Request + schlechteres Crawl-Budget.
**File:** [middleware.ts](middleware.ts) oder [netlify.toml](netlify.toml).

### MITTEL

**3. CSP ohne Nonce**
`script-src 'unsafe-inline' 'unsafe-eval'` öffnet XSS-Tor. Next.js 15 unterstützt nonce-basierte CSP via Middleware.
**File:** [middleware.ts](middleware.ts) → `headers()` anpassen.

**4. Sitemap-`lastmod` generisch**
Alle URLs haben dasselbe lastmod (Build-Timestamp). Pro Seite echte Änderungsdaten wären aussagekräftiger.
**File:** [app/sitemap.ts](app/sitemap.ts).

**5. Schema-Konsolidierung**
9 separate `<script>`-Tags auf Homepage. Ein `@graph`-Container wäre sauberer und 2–4 KB kleiner.
**File:** [app/[locale]/layout.tsx:137-184](app/[locale]/layout.tsx#L137-L184).

### NIEDRIG

**6. Review-Autoren diversifizieren**
Alle 4 Einzel-Reviews im Schema haben `"Tripadvisor-Gast"`. Vornamen/Initialen verwenden (z. B. „Markus K.", „Sophie W.") – authentischer für Google.
**File:** [lib/schema.ts:230-279](lib/schema.ts#L230-L279).

**7. IndexNow-API (Bing + Yandex)**
Bei Content-Updates automatisch an IndexNow pingen. Schnellere Indexierung, nicht implementiert.
**File:** neuer API-Endpoint unter `app/api/indexnow/`.

**8. PageSpeed Insights prüfen**
HTML 138 KB gzipped – akzeptabel. Aber LCP/CLS/INP auf Live-URL verifizieren: https://pagespeed.web.dev/analysis?url=https://gleitschirm-tandemflug.com/de

---

## 8. WAS BEREITS TOP IST

- Einzige H1 pro Seite (gegenüber WP: 14)
- Hreflang + x-default vollständig
- 9 Schema-Entities auf Homepage (inkl. FAQ, Reviews, LocalBusiness, Product)
- AggregateRating: 5,0 / **284** (gewachsen von 250)
- robots.txt: 13 AI-Bots explizit erlaubt
- llms.txt mit E-E-A-T-Content vorbildlich
- HSTS preload, Security-Headers vollständig
- Netlify-Edge-Hosting (niedriger TTFB)
- Clean URLs, kein Trailing Slash, 308 Redirect auf `/de` Default

---

## 9. NÄCHSTE SCHRITTE

| Prio | Aufgabe | Aufwand |
|------|---------|---------|
| HOCH | Meta-Keywords auf 8-12 reduzieren | 5 min |
| HOCH | Cache-Control für HTML in netlify.toml anpassen | 15 min |
| MITTEL | CSP Nonce-basiert machen | 60 min |
| MITTEL | Schema-`@graph` konsolidieren | 30 min |
| MITTEL | Rebuild triggern → sitemap lastmod aktuell | 5 min |
| NIEDRIG | Review-Namen diversifizieren | 10 min |
| NIEDRIG | IndexNow-API einbauen | 45 min |
| NIEDRIG | Lighthouse/PSI-Report ziehen | 10 min |
