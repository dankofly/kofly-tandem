# Partner-Paket Unterkünfte — KOFLY (Stand 2026-07-10)

> **Zweck:** Der Kanal mit dem besten Verhältnis aus Kosten (fast null) und Qualifizierung (Gastgeber-Empfehlung an anwesende Urlauber). Ziel: 20 aktive Partner-Unterkünfte, die KOFLY systematisch empfehlen statt zufällig.

---

## Warum das funktioniert

Unterkünfte im Lienzer Talboden haben bereits eigene Tandemflug-Seiten (Beispiel: Winklers Dolomitenhof/Moarhof) und empfehlen aktiv Aktivitäten. Die Empfehlung passiert also sowieso, nur nicht systematisch für KOFLY. Eine persönliche Gastgeber-Nachricht schlägt jeden Prospektständer, weil sie im richtigen Moment kommt (Anreise) und mit Vertrauen aufgeladen ist.

---

## Das Paket pro Haus (4 Bausteine)

### 1. Partner-Link + QR-Code (messbar pro Haus)

Link-Schema, Ziel ist die Urlauber-Landingpage `/urlaub`:

```
https://gleitschirm-tandemflug.com/de/urlaub?utm_source=partner&utm_medium=referral&utm_campaign={haus-slug}
https://gleitschirm-tandemflug.com/nl/urlaub?utm_source=partner&utm_medium=referral&utm_campaign={haus-slug}
```

Beispiel: `...utm_campaign=camping-falken`

QR-Code pro Haus aus dem jeweiligen DE-Link generieren (ein QR pro Haus, damit zählbar). Auf Zuruf generiere ich alle QR-PNGs als Batch.

### 2. Gästenachricht (für Pre-Arrival-Mail oder Gastgeber-WhatsApp)

**Deutsch:**
> Noch auf der Suche nach eurem Osttirol-Highlight? Das Team von KOFLY fliegt mit euch im Tandem-Gleitschirm über die Lienzer Dolomiten. Ohne Vorkenntnisse, ab €150, bezahlt wird erst nach dem Flug. Sagt ihnen einfach, wie lange ihr da seid: Sie finden den schönsten Flugtag in eurem Urlaub. [Partnerlink]

**Niederländisch:**
> Nog op zoek naar jullie vakantiehighlight in Oost-Tirol? Het team van KOFLY vliegt met jullie in een tandem-paraglider boven de Lienzer Dolomieten. Geen ervaring nodig, vanaf €150, betalen pas na de vlucht. Vertel ze gewoon wanneer jullie er zijn: zij vinden de mooiste vliegdag tijdens jullie vakantie. [Partnerlink]

**Versand-Empfehlung an den Gastgeber:** 2 Tage vor Anreise oder am ersten Urlaubstag.

### 3. Rezeptions-Satz (10 Sekunden)

> "Wenn ihr noch ein Highlight sucht: Unser Tandempilot findet den schönsten Flugtag während eures Aufenthalts. Einfach den QR-Code scannen, die melden sich per WhatsApp."

### 4. Prämienmodell (je Haustyp)

| Haustyp | Modell | Warum |
|---|---|---|
| Hotels (Rezeption/Concierge) | **Kennenlernflug fürs Personal** nach 5 vermittelten Gästen + Gegenseitigkeit (KOFLY empfiehlt das Haus an Fluggäste) | Hotels tun sich mit Cash-Kickbacks schwer, Personal-Benefit wirkt stärker und erzeugt Fürsprecher |
| FeWo / Camping / Pensionen | **€10-15 pro geflogenem Gast** (Annahme, final nach DB-Rechnung festlegen) oder Kennenlernflug | Kleine Gastgeber reagieren auf direkte Prämie |

**Attribution pragmatisch:** Daniel fragt in jeder WhatsApp-Konversation ohnehin nach der Unterkunft (Logistik). Monatliche Strichliste pro Haus reicht. Optional Dev-Schritt 2: `?p={slug}` von /urlaub in den WhatsApp-Prefill durchreichen.

---

## Zielliste (12 verifiziert + 8 Slots)

**Priorität A: sofort besuchen (Nähe, Fit, bestehende Tandem-Affinität)**

| # | Haus | Ort | Warum zuerst |
|---|---|---|---|
| 1 | Winklers Dolomitenhof | Tristach | Hat bereits eigene Tandemflug-Seite → empfiehlt schon, nur systematisieren |
| 2 | Winklers Hotel Moarhof | Lienz | Gleiche Familie wie #1, ein Gespräch, zwei Häuser |
| 3 | Camping Falken | Lienz | Südrand Lienz, Blick auf Dolomiten, viele NL-Gäste im Sommer |
| 4 | Camping Seewiese | Tristach (Tristachersee) | 4-Sterne-Camping, Sommersaison exakt = Flugsaison |
| 5 | Hotel Gribelehof | Lienz (Schlossberg) | Liegt direkt am Hochstein-Fluggebiet, Gäste sehen die Schirme |
| 6 | Familienhotel Moosalm | Lienz (Schlossberg, 1.006 m) | dito, Familienzielgruppe = Premium-Paket-Käufer |

**Priorität B: Woche 2**

| # | Haus | Ort | Winkel |
|---|---|---|---|
| 7 | Parkhotel Tristachersee | Tristach | 4*S, kaufkräftige Gäste, Concierge-Empfehlung |
| 8 | Dolomitengolf Hotel & Spa | Lavant | 4*S, Golf-Gäste = Erlebnis-Budget vorhanden |
| 9 | Grandhotel Lienz | Lienz | 5*, Concierge |
| 10 | Vergeiner's Hotel Traube | Lienz Zentrum | Stadtlage, Lauf-Gäste |
| 11 | Hotel Outside | Matrei | Nationalpark-Gäste, Outdoor-affin |
| 12 | Dolomiten Residenz Sporthotel Sillian | Sillian | Familien-Wellness Hochpustertal, NL-stark |

**Multiplikator:** COOL'S Center of Outdoor Lienz führt selbst ein Partnerhotel-Netz. Gespräch über gegenseitige Empfehlung (die machen Rafting/Canyoning, kein Paragleiten = keine Konkurrenz).

**Slots 13-20 (Daniel füllt aus lokalem Wissen), Kriterien:**
- Nähe zu Landeplatz Postleite / Treffpunkt Gaimberg (Gäste sehen die Landungen)
- Hoher NL-Gästeanteil (Camping, Drautal)
- Persönlicher Draht vorhanden (schnellster Abschluss)
- Ferienwohnungs-Vermieter Gaimberg, Oberlienz, Nußdorf-Debant, Dölsach, Amlach

---

## Rollout

| Woche | Aktion |
|---|---|
| 1 | Häuser 1-6 **persönlich besuchen** (nicht mailen). Paket physisch dalassen: Aufsteller + QR + 1 Seite mit Gästenachricht zum Copy-Pasten |
| 2 | Häuser 7-12 + COOL'S |
| 3 | Slots 13-20 + Nachfassen bei Woche-1-Häusern ("schon Gäste geschickt?") |
| laufend | Monatliche Strichliste, beste 5 Häuser bekommen Extra-Pflege (Personal-Flug einlösen, kleines Danke) |

**Gesprächs-Script (30 Sekunden):**
> "Ich bin Daniel von KOFLY, wir fliegen die Tandemflüge über den Dolomiten. Eure Gäste fragen euch sicher ständig, was sie hier machen sollen. Ich hab euch was vorbereitet, das euch Arbeit abnimmt: eine fertige Nachricht für eure Gäste-Mail und einen QR-Code für die Rezeption. Eure Gäste sagen uns nur, wie lange sie da sind, wir suchen den schönsten Flugtag raus. Kostet euch nichts, und nach 5 Gästen laden wir jemanden von euch selbst zum Flug ein."

---

## Aufsteller-Text (A5, Rezeption/Zimmer)

**DE:**
> **Osttirol von oben**
> Tandem-Gleitschirmflug über den Lienzer Dolomiten
> Ohne Vorkenntnisse · ab €150 · Bezahlung erst nach dem Flug
> **Sag uns, wie lange du hier bist. Wir finden deinen schönsten Flugtag.**
> [QR] → WhatsApp-Anfrage in 30 Sekunden

**NL:**
> **Oost-Tirol van boven**
> Tandem-paragliding boven de Lienzer Dolomieten
> Geen ervaring nodig · vanaf €150 · betalen pas na je vlucht
> **Vertel ons wanneer je er bent. Wij vinden jouw mooiste vliegdag.**
> [QR] → WhatsApp-aanvraag in 30 seconden
