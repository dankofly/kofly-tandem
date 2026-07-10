# Meta Ads Launch — KOFLY Urlauber-Intercept (Stand 2026-07-10)

> **Zweck:** Der einzige Kanal, der Urlauber erreicht, die NIE nach Tandemflug suchen. Haupt-Paid-Kanal: €30/Tag. Click-to-WhatsApp statt Website-Traffic, weil die Site bewusst tracking-arm ist und die Conversion sowieso in WhatsApp passiert.

---

## Voraussetzungen (einmalig, vor Launch) — exakter Klickpfad

**Befund 2026-07-10:** Es existiert keine auffindbare KOFLY-Facebook-Seite (Website verlinkt nur Instagram @tandemfluglienz). Ohne FB-Seite laufen keine Click-to-WhatsApp-Ads, auch nicht auf Instagram. Daher Schritt 0 zuerst.

### Schritt 0: Facebook-Seite anlegen (~10 Min)

1. Vorher in der FB-Suche nach "Gleitschirm Tandemflug" / "KOFLY" suchen: falls eine alte Seite existiert, die übernehmen statt neu anlegen
2. facebook.com → Menü → Seiten → **Neue Seite erstellen**
   - Name: `KOFLY Gleitschirm Tandemflug`
   - Kategorie: Outdoor- und Sportartikel / Sport & Freizeit ("Paragliding" wird als Unterkategorie angeboten)
   - Adresse: Weidachweg 16, 9990 Nußdorf-Debant · Telefon: +43 676 7293888 · Website: gleitschirm-tandemflug.com
   - Profilbild: KOFLY-Logo · Titelbild: bestes Panoramafoto mit Gast
3. 2-3 Posts veröffentlichen (aus GBP-BEITRAEGE-VORRAT.md ziehen), damit die Seite nicht leer wirkt, wenn Ad-Klicker draufschauen

### Schritt 1: Instagram verknüpfen (~2 Min)

Meta Business Suite (business.facebook.com) → Einstellungen → Verknüpfte Konten → Instagram → mit @tandemfluglienz einloggen.

### Schritt 2: WhatsApp auf Business umstellen (~10 Min, VORSICHT)

Die Nummer +43 676 7293888 läuft vermutlich auf normalem WhatsApp. Für CTWA-Ads muss sie auf **WhatsApp Business** (die kostenlose App reicht):

1. **ZUERST Backup:** WhatsApp → Einstellungen → Chats → Chat-Backup → Jetzt sichern
2. WhatsApp Business App installieren → öffnen → +43 676 7293888 bestätigen → Migration übernimmt Chats vom selben Gerät
3. Business-Profil ausfüllen: Name KOFLY, Kategorie, Adresse, Website, Beschreibung ("Sag uns, wann du in Osttirol bist...")
4. ⚠️ **Gotchas:**
   - Danach ist die Nummer NUR noch in WA Business, die normale App ist für diese Nummer tot
   - Der whatsapp-MCP am Rechner (verknüpftes Gerät) verliert die Kopplung → in WA Business: Einstellungen → Verknüpfte Geräte → QR neu scannen

### Schritt 3: WhatsApp mit der FB-Seite verknüpfen (~2 Min)

FB-Seite → Einstellungen → WhatsApp → Nummer eingeben → Code aus WhatsApp Business eintragen.
(Alternative: Beim ersten Anzeigen-Erstellen mit Ziel WhatsApp fragt der Ads Manager die Verknüpfung automatisch ab.)

### Verifikation

Meta Business Suite → Einstellungen → WhatsApp-Konten: Nummer wird angezeigt → CTWA-ready. Kein Pixel nötig, Messung läuft über "begonnene Unterhaltungen" im Ads Manager.

---

## Kampagne: `KOFLY_CTWA_Urlauber`

| Einstellung | Wert |
|---|---|
| Ziel | Interaktionen → Nachrichten → **WhatsApp** |
| Budget | Kampagnenbudget AUS, Budget je Ad Set |
| Platzierungen | Advantage+ (Meta optimiert selbst; Reels/Stories/Feed dominieren ohnehin) |

### Ad Set 1: DE-Urlauber (€15/Tag)

| Einstellung | Wert |
|---|---|
| Standort | **"Personen, die kürzlich an diesem Ort waren" bzw. "auf Reisen an diesem Ort"** (NICHT "wohnhaft in") · Lienz + 40 km Radius (deckt Matrei, Sillian, Defereggental, Drautal) |
| Sprache | Deutsch |
| Alter | 20-60 |
| Interessen | KEINE (Region klein genug, jede Einschränkung würgt die Auslieferung ab) |

### Ad Set 2: NL-Urlauber (€15/Tag)

Wie Ad Set 1, Sprache **Niederländisch**. Das Sprach-Targeting macht die Trennung, nicht der Standort.

### WhatsApp-Prefill der Anzeigen (beide Ad Sets)

DE: `Hallo! Wir sind von [Datum] bis [Datum] in Osttirol, [Anzahl] Personen. Welcher Tag wäre der schönste für unseren Tandemflug?`
NL: `Hallo! Wij zijn van [datum] tot [datum] in Oost-Tirol, [aantal] personen. Welke dag zou de mooiste zijn voor onze tandemvlucht?`

(Identisch mit dem Website-Prefill → eine einheitliche Anfrage-Pipeline.)

---

## Anzeigen-Copy

### DE (Primärtext)

> Du bist gerade in Osttirol?
> Dann fehlt dir noch ein Blick: schwerelos über den Lienzer Dolomiten.
>
> Sag uns, wie lange du hier bist. Wir finden den schönsten Flugtermin in deinem Urlaub. Keine Vorkenntnisse nötig, du fliegst sicher mit erfahrenem Tandempiloten. Bezahlt wird erst nach dem Flug.

**Headline:** Dein Urlaubshighlight über den Dolomiten
**CTA-Button:** Nachricht senden

### NL (Primärtext)

> Op vakantie in Oost-Tirol?
> Dan wacht het mooiste uitzicht van je vakantie nog op je: gewichtloos boven de Lienzer Dolomieten.
>
> Vertel ons wanneer je er bent. Wij vinden de mooiste vliegdag tijdens jouw verblijf. Geen ervaring nodig, je vliegt veilig met een ervaren tandempiloot. Betalen doe je pas na de vlucht.

**Headline:** Jouw vakantiehighlight boven de Dolomieten
**CTA-Button:** Bericht sturen

---

## Creative-Brief: 3 Videos + 1 Statisch (aus vorhandenem Material)

Formate: **9:16** (Reels/Stories) + **4:5** (Feed). Untertitel einbrennen (Ton oft aus). Musik nur aus der Meta-Sound-Library (Lizenz). Länge 8-15 Sekunden. Hook in den ersten 2 Sekunden: Gesicht oder Bewegung, nie Logo.

| # | Clip | Aufbau | Text-Overlay |
|---|---|---|---|
| 1 | **Nervosität → Start** | Gast am Startplatz (nervöses Lachen), 3 Schritte, abheben | "Kribbeln? Gehört dazu." → "Nach 3 Schritten fliegst du." |
| 2 | **Der ruhige Flug** | Ruhige Flugaufnahme, Panorama Dolomiten, Gast entspannt | "Du bist gerade in Osttirol?" → "Das hier fehlt dir noch." |
| 3 | **Nach der Landung** | Jubel/Umarmung/erste Reaktion direkt nach Landung | "Frag sie, was das Highlight ihres Urlaubs war." |
| 4 | **Statisch** | Bestes Panoramafoto mit Gast im Bild | "Osttirol von oben · ab €150 · Bezahlung nach dem Flug" |

Je Video eine DE- und eine NL-Overlay-Version (Overlays sind Text, schnell dupliziert).

---

## Messung + Entscheidungsregeln

| Metrik | Wo | Ziel |
|---|---|---|
| Begonnene Unterhaltungen | Ads Manager | primäre Conversion |
| Kosten pro Unterhaltung | Ads Manager | Annahme: unter €5 gut, unter €10 okay. Nach Woche 1 mit echten Zahlen neu setzen |
| Anfrage → geflogener Gast | manuelle Strichliste (WhatsApp) | Wetterpuffer einrechnen |

- **Bewertungsfenster: 30 Tage**, nicht 14 (Wetter verzerrt kurze Fenster).
- **Nach 7 Tagen:** schwächstes Creative je Ad Set pausieren, bestes dupliziert testen.
- **Kill:** Ad Set nach 30 Tagen ohne einzige Unterhaltung unter €15/Konversation → pausieren, Creative-Problem lösen, nicht Budget erhöhen.
- **Skalieren:** Kosten/Unterhaltung stabil unter Ziel → Budget in 20%-Schritten alle 3-4 Tage rauf (nie verdoppeln, das resettet die Lernphase).

---

## Budget-Kontext

Gesamt-Paid: €30-35/Tag Meta (dieses Doc) + €0-5 Google Defense (nur nach Gate-Check, siehe GOOGLE-ADS-DEFENSE.md).
