# SEO & GEO Audit – Gleitschirm-Tandemflug.com

**Datum:** 17. Februar 2026
**Domain:** https://gleitschirm-tandemflug.com
**Neue Seite (Next.js):** Netlify Deployment (in Entwicklung)

---

## 1. EXECUTIVE SUMMARY

| Bereich | Live (WordPress) | Neu (Next.js) |
|---------|-----------------|---------------|
| Meta-Tags | Doppelte description & OG-Tags | Sauber, pro Locale optimiert |
| Schema/JSON-LD | Nur WebSite + Person, kein LocalBusiness | 6 Schemas: Organization, Service, FAQ, WebSite, Breadcrumb, Reviews |
| AggregateRating (Sterne) | Fehlt komplett | 5.0 / 250 Bewertungen + 4 individuelle Reviews |
| FAQPage Schema | Fehlt komplett | 20 FAQ-Einträge (Google FAQ Rich Snippets) |
| robots.txt | Twitterbot blockiert, keine AI-Bot-Regeln | Alle AI-Bots explizit erlaubt |
| Sitemap | Veraltet (letztes Update 2019), Junk-Seiten enthalten | Dynamisch, alle Locales mit hreflang |
| Hreflang | Nur DE + EN, kein x-default | DE + EN + NL + x-default |
| H1-Tags | 14 Stück (fatal) | 1 pro Seite (korrekt) |
| Ladezeit | WordPress + Avada + LayerSlider (schwer) | Next.js SSG/SSR (schnell) |
| Mobile | Eingeschränkt | Vollständig responsive, Touch-optimiert |
| AI-Sichtbarkeit (GEO) | Keine Optimierung | FAQ, Statistiken, autoritative Sprache |

**Fazit:** Die neue Next.js-Seite ist der WordPress-Seite in allen SEO/GEO-Bereichen deutlich überlegen. Nach dem Go-Live wird ein signifikanter Ranking-Boost erwartet.

---

## 2. LIVE-SITE ANALYSE (WordPress)

### 2.1 Kritische Probleme

| # | Problem | Impact |
|---|---------|--------|
| 1 | **14 H1-Tags** auf der Startseite (sollte genau 1 sein) | KRITISCH – Google kann Hauptthema nicht erkennen |
| 2 | **Doppelte Meta-Description** (Rank Math + Avada Theme) | HOCH – widersprüchliche Signale an Suchmaschinen |
| 3 | **Doppelte Open-Graph-Tags** (zweites Set mit leeren og:image-Werten) | HOCH – Social Shares zeigen kein Bild |
| 4 | **Kein LocalBusiness-Schema** – nur Person/Organization | HOCH – keine Rich Snippets möglich |
| 5 | **Keine AggregateRating** – Sterne fehlen komplett | HOCH – keine Sternchen in Suchergebnissen |
| 6 | **Kein FAQPage-Schema** | HOCH – keine FAQ Rich Snippets |
| 7 | **Sitemap veraltet** – letztes Update Oktober 2019 | HOCH – Google crawlt seltener |
| 8 | **8 Bilder ohne alt-Attribut** (Galerie) | MITTEL – Accessibility + Bilder-SEO |
| 9 | **Twitterbot blockiert** in robots.txt | MITTEL – keine Link-Previews auf X/Twitter |
| 10 | **Kein hreflang x-default** | MITTEL – unklare Standardsprache |

### 2.2 robots.txt (Live)

```
User-agent: Twitterbot    → BLOCKIERT (keine Twitter-Previews)
User-agent: GPTBot         → Nicht erwähnt (erlaubt über Wildcard)
User-agent: ChatGPT-User   → Nicht erwähnt (erlaubt über Wildcard)
User-agent: PerplexityBot   → Nicht erwähnt (erlaubt über Wildcard)
User-agent: ClaudeBot       → Nicht erwähnt (erlaubt über Wildcard)
```

Sitemap-Verweis zeigt auf `/en/sitemap_index.xml` – stimmt nicht mit `/sitemap.xml` überein.

### 2.3 Sitemap (Live)

- **39 URLs** – viele davon veraltet oder Junk
- **Keine hreflang-Alternates**
- **Junk-Seiten enthalten:** `/test/`, `/test2/`, `/fusion_template/impressum-old/`, `/element_category/*`
- **Duplikate:** FAQ-Inhalte unter `/faq/` UND `/faq-items/` (Keyword-Kannibalisierung)
- **Neuestes lastmod:** Oktober 2019 (6+ Jahre alt)

### 2.4 Schema/JSON-LD (Live)

Nur 4 Entities via Rank Math `@graph`:

| Schema | Vorhanden | Bewertung |
|--------|-----------|-----------|
| WebSite | Ja | OK |
| WebPage | Ja | OK |
| Person/Organization (dual type) | Ja | Ungewöhnlich – Google bevorzugt einen Typ |
| ImageObject | Ja | OK |
| **LocalBusiness** | **Nein** | **FEHLT** |
| **AggregateRating** | **Nein** | **FEHLT** |
| **FAQPage** | **Nein** | **FEHLT** |
| **Service/Offer** | **Nein** | **FEHLT** |
| **BreadcrumbList** | **Nein** | **FEHLT** |

---

## 3. NEUE SEITE ANALYSE (Next.js)

### 3.1 Was funktioniert gut

| Bereich | Status | Details |
|---------|--------|---------|
| Meta-Tags | OK | Title, Description, Keywords pro Locale (DE/EN/NL) |
| OpenGraph | OK | Title, Description, locale-spezifisch |
| Twitter Cards | OK | summary_large_image |
| Hreflang | OK | DE, EN, NL + x-default |
| Geo-Meta | OK | AT-7, Lienz, Koordinaten, ICBM |
| robots.txt | OK | Alle AI-Bots erlaubt (GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Bingbot) |
| Sitemap | OK | Dynamisch, alle Locales, alternates, Prioritäten |
| H1-Struktur | OK | 1 H1 pro Seite |
| Mobile UX | OK | Touch-optimiert, responsive |
| Ladezeit | OK | Next.js mit SSG/SSR, optimierte Bilder |

### 3.2 Schema/JSON-LD (Neue Seite)

| Schema | Vorhanden | Felder | Rich-Result-fähig |
|--------|-----------|--------|--------------------|
| Organization + LocalBusiness + SportsActivityLocation | Ja | Name, Adresse, Geo, Öffnungszeiten, Kontakt, areaServed (8 Orte), 3 Locations | Ja |
| AggregateRating | Ja | 5.0 / 250 Bewertungen, bestRating, worstRating | **Ja – Sterne in Suchergebnissen** |
| 4x individuelle Reviews | Ja | Author, Date, Rating, ReviewBody | Ja – stärkt AggregateRating |
| Service + OfferCatalog (5 Pakete) | Ja | Preise, Beschreibungen, URLs | Ja |
| FAQPage (20 Fragen) | Ja | Question/Answer Format | **Ja – FAQ Rich Snippets** |
| WebSite + SearchAction | Ja | Name, Publisher, Sprache | Ja |
| BreadcrumbList | Ja | Auf /ablauf und /buchen | **Ja – Breadcrumb Rich Snippets** |

### 3.3 Verbesserungspotential (Neue Seite)

| # | Empfehlung | Priorität | Status |
|---|-----------|-----------|--------|
| 1 | `image` + `logo` zur Organization hinzufügen | HOCH | Offen |
| 2 | FAQ-Schema nur auf Homepage injizieren (nicht auf allen Unterseiten via Layout) | MITTEL | Offen |
| 3 | Review-Autoren diversifizieren (alle heißen "Tripadvisor-Gast") | NIEDRIG | Offen |
| 4 | `availability` auf Offers hinzufügen | NIEDRIG | Offen |
| 5 | SearchAction-Target prüfen (`/buchen?q=` verarbeitet keine Suche) | NIEDRIG | Offen |
| 6 | VoucherService-Schema erweitern (@id, serviceType, Preis) | NIEDRIG | Offen |

---

## 4. KEYWORD-ABDECKUNG

### 4.1 Primäre Keywords (Hauptzielgruppe)

| Keyword | Meta | Schema | FAQ | Content |
|---------|------|--------|-----|---------|
| Gleitschirm Tandemflug | Title, H1 | Org, Service | Ja | Ja |
| Paragleiten Osttirol | Title, Desc | Org, Service | Ja | Ja |
| Tandemflug Lienz | Title, Keywords | Org, areaServed | Ja | Ja |
| Tandemfliegen Osttirol | Keywords | Org | Ja | Ja |
| Gleitschirmfliegen Osttirol | Keywords | Org, Service | Ja | Ja |
| Tandemsprung Osttirol | Keywords | Org | – | Ja |

### 4.2 Regionale Keywords (Orte)

| Ort | Meta-Keywords | Schema areaServed | FAQ | Anfahrtszeit |
|-----|---------------|-------------------|-----|-------------|
| Lienz | Ja | Ja | Ja | Startort |
| Sillian | Ja | Ja | Ja | ca. 30 Min |
| Matrei | Ja | Ja | Ja | ca. 25 Min |
| Kals am Großglockner | Ja | Ja | Ja | ca. 40 Min |
| St. Jakob / Defereggental | Ja | Ja | Ja | ca. 35 Min |
| Nußdorf-Debant | Ja | Ja | – | Bei Lienz |

### 4.3 Tourismus-Keywords (NEU hinzugefügt)

| Keyword | Meta | Schema | FAQ |
|---------|------|--------|-----|
| Urlaub Osttirol | Ja | Ja | Ja |
| Aktivitäten Osttirol | Ja | Ja | Ja |
| Outdoor Aktivitäten Osttirol | Ja | Ja | Ja |
| Erlebnisse Osttirol | Ja | Ja | – |
| Freizeit Osttirol | Ja | Ja | – |
| Ausflugsziele Lienz | Ja | – | Ja |

### 4.4 Konkurrenz-Keywords (NEU hinzugefügt)

| Keyword | Meta | Schema | FAQ |
|---------|------|--------|-----|
| Airtime Austria | Ja | Ja | Ja |
| Bruno Girstmair | Ja | – | Ja |
| Flugschule Tirol | Ja | Ja | Ja |
| Landeplatz Postleite | Ja | – | Ja |

---

## 5. GEO-OPTIMIERUNG (AI-Suchmaschinen)

### 5.1 Princeton GEO-Methoden – Umsetzungsstatus

| Methode | Boost | Status | Wo umgesetzt |
|---------|-------|--------|-------------|
| Statistiken einfügen | +37% | Ja | FAQ: "5,0 Sterne aus über 250 Bewertungen", "ab €150", "10.000+ Flüge" |
| Autoritative Sprache | +25% | Ja | FAQ: "führender Anbieter", "Nr. 1 Outdoor-Aktivität" |
| Quellen zitieren | +40% | Ja | FAQ: Tripadvisor-Referenzen |
| Verständliche Sprache | +20% | Ja | FAQ: klare, einfache Antworten |
| Technische Begriffe | +18% | Ja | "Thermik", "Airpark", "Zettersfeld", "Hochstein" |
| Flüssiger Text | +15-30% | Ja | Gut strukturierte FAQ-Antworten |
| Keyword Stuffing | **-10%** | Vermieden | Keywords natürlich verteilt |

### 5.2 AI-Bot-Zugang

| Bot | Zweck | robots.txt | Status |
|-----|-------|------------|--------|
| GPTBot | OpenAI Training | Allow: / | Erlaubt |
| ChatGPT-User | ChatGPT Browsing | Allow: / | Erlaubt |
| PerplexityBot | Perplexity AI | Allow: / | Erlaubt |
| ClaudeBot | Claude AI | Allow: / | Erlaubt |
| anthropic-ai | Anthropic | Allow: / | Erlaubt |
| Googlebot | Google + AI Overview | Allow: / | Erlaubt |
| Bingbot | Bing + Copilot | Allow: / | Erlaubt |

### 5.3 AI-Zusammenfassung Optimierung

Die FAQ-Antworten sind im "Answer-First"-Format geschrieben – direkte Antwort am Anfang, dann Details. Das ist ideal für:
- **Google AI Overview** – wird als Quelle zitiert
- **ChatGPT** – bevorzugt Seiten mit strukturierten, faktenreichen Antworten
- **Perplexity** – nutzt FAQ-Schema bevorzugt für Zitate

---

## 6. RICH RESULTS ERWARTUNG

Nach Go-Live der neuen Next.js-Seite:

| Rich Result | Wahrscheinlichkeit | Voraussetzung |
|-------------|-------------------|---------------|
| Sterne (AggregateRating) | **HOCH** | AggregateRating + Reviews vorhanden |
| FAQ-Snippets | **HOCH** | FAQPage Schema korrekt strukturiert |
| Breadcrumbs | **HOCH** | BreadcrumbList auf Unterseiten |
| Sitelinks Search Box | **MITTEL** | SearchAction vorhanden (Target prüfen) |
| Knowledge Panel | **MITTEL** | Organization + sameAs vorhanden |
| Local Pack (Maps) | **MITTEL** | LocalBusiness + Geo + Öffnungszeiten |

---

## 7. EMPFOHLENE NÄCHSTE SCHRITTE

### Priorität HOCH (vor Go-Live)
1. `image` und `logo` zum Organization-Schema hinzufügen
2. FAQ-Schema aus dem Layout entfernen (nur auf Homepage behalten)
3. Google Search Console nach Go-Live verifizieren
4. Bing Webmaster Tools einrichten
5. IndexNow-API für schnellere Indexierung implementieren

### Priorität MITTEL (nach Go-Live)
6. Google Rich Results Test durchführen: https://search.google.com/test/rich-results
7. Schema.org Validator prüfen: https://validator.schema.org
8. Google Business Profile mit neuer URL verknüpfen
9. Tripadvisor-Profil mit neuer URL aktualisieren
10. Backlinks von der alten WP-Seite per 301-Redirect umleiten

### Priorität NIEDRIG (Optimierung)
11. Review-Autoren diversifizieren
12. VoucherService-Schema erweitern
13. Availability auf Offers hinzufügen
14. Brave Search Indexierung prüfen (für Claude AI)
15. Content-Cluster aufbauen (Blog/Ratgeber zu Paragliding-Themen)
