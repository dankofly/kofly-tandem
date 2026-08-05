# SEO, GEO & Performance-Audit - Gleitschirm-Tandemflug.com

**Datum:** 5. August 2026 (Vorheriges Audit: 17. April 2026, Note 9,2)
**Domain:** https://gleitschirm-tandemflug.com
**Hosting:** Netlify (Next.js 15, SSG/SSR)

---

## 1. EXECUTIVE SUMMARY

| Bereich | Status | Score |
|---------|--------|-------|
| On-Page SEO (Meta, H1, Canonical, hreflang) | Exzellent | 10 / 10 |
| Schema / JSON-LD | Exzellent | 9,5 / 10 |
| GEO (AI-Suchmaschinen, llms.txt) | Exzellent | 9,5 / 10 |
| Technisch (Headers, Caching, HTTPS) | Sehr gut | 9,0 / 10 |
| Performance (LCP, CLS, TTFB) | Exzellent | 9,5 / 10 |
| Accessibility | Gut | 8,0 / 10 |
| Search-Leistung (GSC) | Ausbaufähig | 6,5 / 10 |

**Gesamtnote: 9,3 / 10.** Technik ist top, 6 von 8 April-Findings sind gefixt. Der Engpass ist nicht mehr die Technik, sondern Rankings und CTR (Position ~15, 72 Klicks / 28 Tage).

### Status der 8 Findings aus dem April-Audit

| # | Finding (April) | Status heute |
|---|-----------------|--------------|
| 1 | Meta-Keywords-Overload (44) | GEFIXT: jetzt 10 Keywords |
| 2 | Cache-Control `no-store` auf HTML | GEFIXT: `public, s-maxage=3600, stale-while-revalidate=86400`, Netlify Durable Cache greift (Cache-Status: hit) |
| 3 | CSP ohne Nonce (`unsafe-inline` + `unsafe-eval`) | OFFEN (einziges verbliebenes Technik-Finding) |
| 4 | Sitemap-lastmod generisch | GEFIXT: echte Daten pro URL (2026-02-01 / 2026-07-13) |
| 5 | Schema-Konsolidierung | GEFIXT: 6 statt 9 Skripte, `@graph` im Einsatz |
| 6 | Review-Autoren "Tripadvisor-Gast" | GEFIXT: Carmen S., Georg K., Familie Övermann, Christina S. |
| 7 | IndexNow-API | OFFEN (Prio niedrig) |
| 8 | Lighthouse/PSI-Report | ERLEDIGT: siehe Abschnitt 4 |

---

## 2. ON-PAGE SEO - LIVE-CHECK (2026-08-05)

### Homepage `/de`

| Element | Wert | Bewertung |
|---------|------|-----------|
| `<title>` | `Tandemflug Lienz – Paragleiten Osttirol ab €150 \| KOFLY` | OK |
| Meta Description | 149 Zeichen | OK |
| Meta Keywords | 10 (war 44) | OK |
| Canonical | `https://gleitschirm-tandemflug.com/de` | OK |
| Hreflang | de/en/nl/x-default, im HTML UND als HTTP-Link-Header | OK, doppelt abgesichert |
| OG-Tags | Komplett inkl. image:alt, width, height | OK |
| H1-Count | 1 | OK |
| Robots | `index, follow` | OK |
| Bilder | 18 `<img>`, 0 ohne alt-Attribut | OK |

EN- und NL-Version: 200, korrekte lokalisierte Titles, Canonicals pro Locale.

### Sitemap & robots.txt

- Sitemap: **54 URLs** (April: 30), hreflang-Alternates, echte lastmod-Daten.
- robots.txt: alle relevanten AI-Bots explizit erlaubt (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended etc.), `/api/` und `/admin/` gesperrt.
- llms.txt: 21,9 KB, E-E-A-T-Content, weiterhin vorbildlich.

---

## 3. SCHEMA / JSON-LD

6 Skripte (konsolidiert via `@graph`), Entities: Organization + LocalBusiness + SportsActivityLocation, 2× Service, WebSite, TouristAttraction, ItemList, Person, FAQPage, Product.

**AggregateRating: 5,0 / 303 Bewertungen** (April: 284, Wachstum +19). Review-Autoren diversifiziert.

---

## 4. PERFORMANCE (Lighthouse + Trace, Live-URL)

### Core Web Vitals (Lab, Mobile-Emulation)

| Metrik | Wert | Schwelle "gut" | Bewertung |
|--------|------|----------------|-----------|
| LCP | **752 ms** | < 2.500 ms | Exzellent |
| CLS | **0,00** | < 0,1 | Perfekt |
| TTFB (Browser) | 235 ms | < 800 ms | Exzellent |
| TTFB (curl, warm) | 100-160 ms | | Edge-Cache greift |

LCP-Breakdown: 235 ms TTFB + 517 ms Render Delay. Kein CrUX-Felddaten-Eintrag (zu wenig Traffic für Google-Sample), Lab-Werte sind aber eindeutig.

### Lighthouse-Scores (Mobile)

| Kategorie | Score |
|-----------|-------|
| SEO | **100** |
| Best Practices | **100** |
| Accessibility | 92 |

### Accessibility-Findings (Score 92)

1. **Kontrast 3,22:1 statt 4,5:1** auf `text-accent-500` (#e86830 auf #fdfefe): kleine Labels, "Mehr erfahren"-Links und der orange Buchen-Button (weiß auf #e86830 = 3,25:1). Der Kontrast-Fix vom Juli (PR #24) hat offenbar nicht alle Accent-Stellen erfasst.
2. **aria-prohibited-attr:** `aria-label="5 von 5 Sternen"` auf `<div>` ohne role. Fix: `role="img"` ergänzen.
3. **label-content-name-mismatch:** Kofly-KI-Button, sichtbarer Text fehlt im `aria-label`.

---

## 5. SEARCH-LEISTUNG (GSC, letzte 28 Tage)

| Metrik | Wert |
|--------|------|
| Klicks | 72 |
| Impressionen | 2.143 |
| CTR | 3,36 % |
| Ø Position | 15,1 |

### Top-Queries

| Query | Klicks | Impr. | Position |
|-------|--------|-------|----------|
| kofly | 6 | 12 | 1,8 |
| daniel kofler | 3 | 88 | 3,7 |
| tandem lienz | 3 | 33 | 3,1 |
| lienz paragliding | 2 | 17 | 4,8 |
| gleitschirm tandemflug | 0 | 20 | 11,2 |

### Beobachtungen

- **Brand-Queries dominieren.** Generische Money-Keywords ("gleitschirm tandemflug" Pos. 11, "tandemflug lienz" via Unterseite Pos. 8,6) hängen auf Seite 2 bzw. unteren Positionen von Seite 1: 0 Klicks.
- **`/de/sicherheit`: 168 Impressionen, Position 6,8, 0 Klicks.** Auffälligster CTR-Ausfall, Title/Description dieser Seite auf Klickanreiz prüfen.
- **`/de/tandemflug-lienz`: 126 Impressionen, Position 8,6, 0 Klicks.** Gleiche Diagnose.
- **`/de/ueber-uns` performt am besten** (CTR 7,4 %, Pos. 3,9): getragen von "daniel kofler" und "kofly", also Brand.
- Homepage Position 21,8 im Schnitt: sie rankt für viele irrelevante Queries mit (Flüge nach Lienz, Flugplatz etc.), das drückt den Schnitt, ist aber unkritisch.

---

## 6. FINDINGS (Priorisiert)

### HOCH (wirkt auf Klicks)

**1. CTR-Rettung für `/de/sicherheit` und `/de/tandemflug-lienz`**
Zusammen ~300 Impressionen bei Position 6-8 und 0 Klicks. Titles/Descriptions auf Suchintention und Klickanreiz umschreiben (Preis, Rating, USP in den Title).

**2. Money-Keyword "gleitschirm tandemflug" (Pos. 11)**
Domain-Exact-Match-Keyword knapp hinter Seite 1. Interne Verlinkung auf die passende Landing stärken, Content-Tiefe der Zielseite prüfen.

### MITTEL

**3. Kontrast-Regression auf Accent-Farbe (#e86830)**
Kleine Texte und Buchen-Button unter 4,5:1. Entweder Accent auf kleinen Texten abdunkeln (~#c94f1a Richtung) oder Schriftgröße/-gewicht auf Large-Text-Schwelle (3:1) heben. Files: Tailwind-Token `accent-500`, Button-Komponente.

**4. CSP-Nonce (Rest aus April)**
`script-src 'unsafe-inline' 'unsafe-eval'` weiterhin aktiv. Next.js 15 Middleware-Nonce, Aufwand ~60 min.

### NIEDRIG

**5. ARIA-Kleinigkeiten:** `role="img"` auf Sterne-Divs, Kofly-KI-Button-Label angleichen. 10 min.
**6. IndexNow-API:** weiterhin nicht implementiert, weiterhin optional.

---

## 7. WAS TOP IST

- Lighthouse SEO 100, Best Practices 100
- LCP 752 ms, CLS 0,00, TTFB ~100-235 ms mit Netlify Durable Cache (hit)
- 6/8 April-Findings gefixt
- Sitemap 54 URLs mit echten lastmod-Daten
- Schema als `@graph`, Rating 5,0/303 wachsend
- hreflang doppelt (HTML + HTTP-Header)
- llms.txt + 13 AI-Bots erlaubt: GEO-seitig weiter über Branchenschnitt

## 8. NÄCHSTE SCHRITTE

| Prio | Aufgabe | Aufwand |
|------|---------|---------|
| HOCH | Title/Description `/de/sicherheit` + `/de/tandemflug-lienz` auf CTR optimieren | 30 min |
| HOCH | "gleitschirm tandemflug" auf Seite 1 bringen (interne Links, Content) | 60 min |
| MITTEL | Accent-Kontrast auf kleinen Texten fixen | 30 min |
| MITTEL | CSP Nonce-basiert | 60 min |
| NIEDRIG | ARIA-Fixes (Sterne, KI-Button) | 10 min |
