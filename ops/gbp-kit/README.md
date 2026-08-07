# GBP Review-Kit — KOFLY Tandemflug

**Stand:** 2026-08-07
**Gehört zu:** GBP-ACTION-PLAN.md, Schritt 2 (Review-Velocity)

## Der Link, den du überall verwendest

```
https://gleitschirm-tandemflug.com/bewerten
```

Das ist eine Seite auf der eigenen Domain, die in einem Tap ins
Google-Bewertungsformular führt. Sie ist auf `noindex` gesetzt und steht nicht
in der Sitemap, sie ist reines Werkzeug.

**Warum nicht direkt der Google-Link?** Drei Gründe:

1. `gleitschirm-tandemflug.com/bewerten` kann man vorlesen, tippen und in
   WhatsApp verschicken. Der rohe `writereview`-Link mit Place-ID nicht.
2. Wenn sich das Google-Ziel ändert, ändert sich eine Konstante in
   `lib/reviews-config.ts`. **Gedruckte Schilder und alte WhatsApp-Nachrichten
   bleiben gültig.**
3. Gäste ohne Google-Konto landen sonst in einer Sackgasse. Die Seite bietet
   ihnen Tripadvisor als Alternative an.

Auf der Seite ist die mobile Buchungsleiste bewusst ausgeblendet: dort soll es
genau einen Klick geben.

### Das Google-Ziel dahinter

```
https://search.google.com/local/writereview?placeid=ChIJPei3q7tdd0cRoY1vxOQ0cgo
```

Place-ID abgeleitet aus dem Maps-Profil "Gleitschirm Tandemflug. Flieg mit
KOFLY" (FTID `0x47775dbbabb7e83d:0xa7234e4c46f8da1`, Nussdorf-Debant).
Gepflegt wird der Wert in `lib/reviews-config.ts` als `GOOGLE_REVIEW_URL`.

**Verifizierung (10 Sekunden, einmalig, bitte vor dem Drucken):**
`gleitschirm-tandemflug.com/bewerten` am Handy öffnen, mit Google-Konto
eingeloggt, auf den Button tippen. Es muss das Bewertungsfenster für das
KOFLY-Profil erscheinen.

Falls Google im GBP-Dashboard einen eigenen Kurzlink anbietet
(business.google.com → "Mehr Rezensionen erhalten" → "Formular teilen"):
diesen bevorzugen und in `lib/reviews-config.ts` eintragen. Der QR-Code bleibt
dann unverändert gültig.

## QR-Code

`review-qr.png` (900 px, Fehlerkorrektur H, druckfertig). Zeigt seit
2026-08-07 auf `/bewerten`, nicht mehr direkt auf Google. Zurückgelesen und
bestätigt.

Fehlerkorrektur H heißt: der Code funktioniert auch dann noch, wenn ein Teil
verkratzt, verschmutzt oder verblasst ist. Für ein Schild, das im Freien am
Landeplatz hängt, ist das der Unterschied zwischen funktioniert und
funktioniert nicht mehr.

Verwendung:

- Laminiertes Schild am Landeplatz Gaimberg ("Hat's dir gefallen? 30 Sekunden, die uns riesig helfen")
- Aufkleber auf dem Foto-/Video-Übergabegerät
- Rückseite Visitenkarte / Gutschein

Neu erzeugen, falls nötig:

```bash
python -c "import segno; segno.make('https://gleitschirm-tandemflug.com/bewerten', error='h').save('ops/gbp-kit/review-qr.png', scale=20, border=4, dark='#0a1a22', light='#ffffff')"
```

## WhatsApp-Vorlage (am Abend des Flugtags)

> Hey [Name], danke für deinen Flug heute! Wenn dir's gefallen hat, freuen wir
> uns riesig über eine kurze Google-Bewertung:
> https://gleitschirm-tandemflug.com/bewerten
> Blauen Himmel, Daniel & Team KOFLY

Englisch:

> Hey [Name], thanks for flying with us today! If you enjoyed it, we would love
> a short Google review: https://gleitschirm-tandemflug.com/bewerten
> Blue skies, Daniel & Team KOFLY

Niederländisch:

> Hoi [Name], bedankt voor je vlucht vandaag! Als het je bevallen is, zijn we
> heel blij met een korte Google-review:
> https://gleitschirm-tandemflug.com/bewerten
> Blauwe luchten, Daniel & Team KOFLY

Die Seite erkennt die Sprache nicht automatisch. Wer die niederländische
Fassung will, hängt `/nl/bewerten` an, englisch `/en/bewerten`.

## Antwort-Vorlagen für neue Reviews

Jede Review beantworten, kurz und persönlich. "Lienz", "Zettersfeld" oder
"Hochstein" einbauen, wo es natürlich passt. Drei Varianten zum Rotieren:

1. > Danke [Name]! Der Flug vom Zettersfeld über Lienz war auch für uns ein
   > schöner. Bis zum nächsten Mal, Daniel
2. > Danke für die 5 Sterne, [Name]! Freut uns, dass der Tandemflug über den
   > Lienzer Talboden für dich ein Highlight war.
3. > Merci [Name]! Genau dafür machen wir das. Grüße aus Osttirol, Team KOFLY

## Frequenzziel

3 bis 5 frische Google-Reviews pro Woche in der Saison. Maps gewichtet Anzahl
UND Frische. Aktueller Stand 2026-07-03: Google 41, Tripadvisor 262.
Wettbewerber Greifenburg: 163 Google-Reviews.

**Warum das der wichtigste Hebel ist:** Die Website steht auf AUT-Mobile bei
"paragliding lienz" auf Position 3,7, bei "paragleiten lienz" auf 4,5 und bei
"tandemflug" auf 5,2 und holt dort in 90 Tagen null Klicks. Bei "kofly" auf
Position 1 holt dieselbe Seite 80 Prozent. Das Ranking ist also nicht das
Problem, das Map-Pack darüber ist es. Und das entscheidet sich über Anzahl und
Frische der Google-Reviews, nicht über die Website.
