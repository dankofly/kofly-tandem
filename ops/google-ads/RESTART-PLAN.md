# Google Ads Neustart-Plan — KOFLY (Stand 2026-07-18)

> **Zweck:** Sauberer Wiedereinstieg in Google Ads nach der Betriebspause.
> Baut auf der bestehenden Doktrin in [`GOOGLE-ADS-DEFENSE.md`](../../GOOGLE-ADS-DEFENSE.md) auf
> (Defense-only, Gate-Check, Volumen kommt von Meta + Partner + GBP). Diese Datei ersetzt die
> Defense-Doku NICHT, sie ergänzt Messung und Ablauf.

---

## Warum dieser Plan existiert (Audit 2026-07-18)

Die alte Kampagne **"Das Osttirol-Highlight"** (ID 22068022488, Konto 182-579-4970) ist eine
**Smart-Kampagne**: Keyword-Themes statt Keywords, kein Suchbegriff-Einblick, keine
Gebotssteuerung, 50-km-Radius als einziges Geo.

**Bilanz 2025: ~645 EUR Spend, 347 Klicks, 0 gemessene Conversions.**
Es gab nie echtes Conversion-Tracking, nur automatische "Local actions" und ein totes
Universal-Analytics-Ziel. Konsequenz: erst messen, dann Geld ausgeben.

**Die Smart-Kampagne bleibt pausiert und wird nach Aktivierung der neuen Kampagne GELÖSCHT,
nicht reaktiviert.**

---

## Phase 0 — First-Party-Attribution (ERLEDIGT, im Code seit 2026-07-18)

Die Website bleibt tracking-arm: **kein Google-Tag, kein Cookie, kein Drittanbieter-Script.**
Stattdessen:

- `lib/attribution.ts` + `components/AttributionCapture.tsx` (im Layout): merkt sich
  `gclid` + `utm_*` aus der Einstiegs-URL in sessionStorage (nur Tab-Sitzung).
- `BookingForm` + `VoucherForm` schicken die Attribution mit an `/api/lead`.
- Die Telegram-Lead-Nachricht zeigt jetzt Quelle, Einstiegsseite und **gclid**.

Damit ist jeder Lead seiner Quelle zuordenbar. Der gclid ist der Schlüssel für den
Offline-Conversion-Upload (Phase 1/laufender Betrieb). WhatsApp-Klicks bleiben wie gehabt
über die Prefill-Korrelation erkennbar (siehe Defense-Doku, Abschnitt Messung).

**Offener Randpunkt:** Datenschutzerklärung um einen Satz zu Herkunftsdaten ergänzen
("Bei Anfragen verarbeiten wir die Kampagnen-Herkunft Ihres Besuchs, z.B. eine Google-Klick-ID").
Kurz halten, vor Aktivierung erledigen.

## Phase 1 — Conversion-Actions anlegen (DANIEL, ~15 min, braucht nur Google-Ads-Zugang)

Google Ads → **Ziele → Conversions → Neue Conversion-Aktion → Importieren →
"Manuelle Importe mit API oder Uploads" → Conversions aus Klicks**. Zwei Aktionen anlegen:

| Feld | Aktion 1 | Aktion 2 |
|---|---|---|
| Name | `Buchungsanfrage (Import)` | `Gutschein-Bestellung (Import)` |
| Kategorie | Lead-Formular senden | Kauf |
| Wert | 150 EUR (Standardwert, anpassbar je Upload) | tatsächlicher Gutscheinwert |
| Zählung | Eine pro Klick | Jede |
| Klick-Conversion-Fenster | 90 Tage | 90 Tage |
| Primär/Sekundär | **Primär** | **Primär** |

Gleichzeitig die alten Auto-Ziele entrümpeln: "Local actions"-Aktionen und das
Universal-Analytics-Ziel "Website Klicks" auf **Sekundär** stellen, damit sie kein
Bidding beeinflussen.

## Phase 2 — Kampagne aktivieren (erst nach Betriebs-Neustart + positivem Gate-Check)

1. **Gate-Check aus der Defense-Doku durchführen** (Handy vor Ort + Transparency Center).
   Negativ → nicht aktivieren, Budget bleibt bei Meta. Das gilt weiterhin.
2. Bei positivem Check: Kampagne **`KOFLY_Search_Defense`** exakt nach
   [`GOOGLE-ADS-DEFENSE.md`](../../GOOGLE-ADS-DEFENSE.md) anlegen (Einstellungen, 3 Anzeigengruppen,
   Keywords, RSAs, Negatives, Assets, UTM-URLs stehen dort komplett).
3. Alte Smart-Kampagne "Das Osttirol-Highlight" **löschen**.
4. Budget-Rahmen: 5 EUR/Tag Defense (siehe Defense-Doku). Erhöhung nur über das
   Erweiterungsmodul unten.

## Laufender Betrieb — wöchentlicher Offline-Upload (5 min/Woche)

Jeden Montag: Leads der Woche aus Telegram durchgehen. Für jeden Lead **mit gclid**:

1. Google Ads → Ziele → Conversions → **Uploads** → CSV hochladen (oder Google-Sheet-Vorlage verknüpfen).
2. CSV-Format:

```csv
Parameters:TimeZone=Europe/Vienna
Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency
<gclid aus Telegram>,Buchungsanfrage (Import),2026-07-20 14:30:00,150,EUR
```

3. Conversion Time = Zeitpunkt der Anfrage (steht in der Telegram-Nachricht). Muss NACH dem
   Klick liegen; gclid ist 90 Tage gültig.
4. Optional sauberer: nur **qualifizierte** Anfragen hochladen (echte Buchung zustande gekommen).
   Dann optimiert Google auf Buchungen statt auf Anfragen.

**Später automatisierbar:** Sobald der Google-Ads-API Basic Access genehmigt ist
(Antrag Case 6-1000000041337, läuft), kann der Upload per Script direkt aus den Leads erfolgen.

## Bidding-Fahrplan

| Stand | Strategie |
|---|---|
| 0 bis ~20 importierte Conversions | Klicks maximieren mit CPC-Limit 1,50 EUR (wie Defense-Doku) |
| Ab ~20-30 Conversions in 90 Tagen | Umstieg auf "Conversions maximieren", beobachten |
| CPA stabil unter ~15 EUR pro Anfrage | Ziel-CPA setzen, Budget vorsichtig anheben |

## Erweiterungsmodul "Planung DACH" (NUR nach bewiesener CPA)

Erst wenn die Defense-Kampagne über 30+ Tage einen belegten Preis pro Anfrage liefert:
vierte Anzeigengruppe **"Planung"** mit eigener Geo-Ebene (Deutschland/Österreich/Niederlande,
Standortoption "Anwesenheit ODER Interesse") auf Urlaubs-Planungs-Queries:

```
[tandemflug osttirol]
[gleitschirm tandemflug österreich]
"paragleiten osttirol urlaub"
[tandem paragliding austria]
```

Eigenes Tagesbudget (5-10 EUR), gleiche RSAs mit angepasster Headline-Reihenfolge
(Urlaubs-Framing nach vorn). Das ist der einzige Volumen-Hebel in Google; er wird NICHT
aktiviert, solange die Defense-Basis keine Conversions belegt.

## Kill-Kriterien (unverändert aus der Defense-Doku)

- 30 Tage aktiv, Budget wird nicht ausgegeben UND keine Konkurrenz-Anzeigen mehr sichtbar → pausieren.
- Budget weg ohne einzige zuordenbare Anfrage → CPC-Limit senken oder pausieren.
- Bewertungsfenster immer 30 Tage (Wetterabhängigkeit), nie 14.

---

## Checkliste bis zum Go-Live

- [x] First-Party-Attribution im Code (2026-07-18)
- [ ] PR mergen + deployen, Test-Lead mit `?gclid=TEST123` absenden und gclid in Telegram prüfen
- [ ] Datenschutz-Passus Herkunftsdaten ergänzen
- [ ] Conversion-Actions anlegen (Phase 1, Daniel)
- [ ] Alte Auto-Ziele auf Sekundär stellen
- [ ] Betriebs-Neustart abwarten
- [ ] Gate-Check → bei positivem Ergebnis `KOFLY_Search_Defense` anlegen
- [ ] Smart-Kampagne "Das Osttirol-Highlight" löschen
