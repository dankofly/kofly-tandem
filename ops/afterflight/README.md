# Afterflight-Beilage (Foto- & Videopaket)

PDF-Beilage im KOFLY-Branding, die mit jedem Foto- und Videopaket mitgeliefert wird.
2 Seiten A4: Danke + Bewertungs-Bitte (Google/Tripadvisor-QR) und Service/Angebot mit WhatsApp-CTA.

## Build

```
python build.py
```

Erzeugt `KOFLY-Afterflight-Beilage.pdf` aus `template.html`. QR-Codes (segno) und
Bilder (`public/images/hero-*.webp`, `public/icon-512.png`, `screens/crop_*.png`)
werden als Data-URIs eingebettet, Rendering über headless Chrome/Edge.

Texte und Preise anpassen: direkt in `template.html`. QR-Ziele: in `build.py` (`QR_TARGETS`).

## App-Screens (`screens/`)

Original-Screenshots der Tandemify-App, per Playwright von `booking.kofly.at/p/demo`
und `/p/demo/after` aufgenommen (Mobile-Viewport 390px, DPR 2, fixe UI-Elemente
ausgeblendet). `full_welcome.png` / `full_after.png` sind die Full-Page-Quellen,
`crop_*.png` die drei Ausschnitte fürs PDF (Flugpass/Countdown, Treffpunkt/Landeplatz,
After-Page). Neu zuschneiden: Crop-Fenster siehe Git-History oder einfach neu wählen,
Aspekt 780x1340.

Hinweis: Die Demo zeigt Platzhalter-Namen (Passagierin "Anna", Pilot "Felix Bergmann").

**Achtung Demo-Daten:** Die Tandemify-Demo zeigt als Landeplatz "Tristacher See", den es
real nicht gibt. Beim Screenshot-Nehmen wird der Text deshalb per DOM-Edit auf den echten
"Landeplatz Touch Heaven" (nahe Talstation) korrigiert (siehe Re-Shoot-Ablauf unten).
Sauberer wäre, die Demo-Daten direkt in Tandemify zu fixen - offen.

Re-Shoot-Ablauf: `booking.kofly.at/p/demo` mit Playwright laden (Viewport 390px, DPR 2),
fixe Buttons ausblenden, Tristacher-Texte ersetzen, Full-Page-Shot als `full_welcome.png`,
Crops 390x670 CSS-px ab Kartenoberkante minus 8px (Flugpass-Card bzw. Treffpunkt-Card).

## Fixes (2026-07-12, nachmittags)

- Hero getauscht: `hero-1771273007982.webp` (Sonnenuntergang, pinker Himmel, unleserlich
  auf dunklem Layout) → kurz `tandemflug-lienz-hero.webp`, auf Daniels Wunsch final
  `tandemflug-zettersfeld-hero.webp` (Schirm über Dolomiten-Kette, kühle Blautöne).
  Hinweis: 1333px breit = ~161 dpi bei 210mm, im Druck etwas weicher als die
  1920px-Alternativen. Falls es eine höher aufgelöste Version gibt, austauschen.
- **Gradient-Overlay komplett entfernt.** Root Cause des Pink-Stichs: Chrome wandelt
  CSS-Gradients mit Alpha beim PDF-Export in eine Transparenz-Maske (SMask) um, die
  manche PDF-Viewer magenta rendern (PDFium/Chrome-Viewer korrekt, andere nicht).
  Merksatz für dieses Template: flache rgba-Füllungen sind ok (Badge/Brand-Pill),
  opake Gradients sind ok (CTA), **Gradients mit Alpha sind verboten**.
- H1 sitzt jetzt komplett unter dem Foto (kein Überlapp, keine Text-auf-Bild-Probleme),
  Hero 106→92mm, Brand links in Pill wie das Badge rechts.
- PDF-Verifikation ab jetzt über pypdfium2-Render der fertigen PDF (nicht nur
  HTML-Screenshot), sonst bleiben Export-Artefakte unsichtbar.
- Screenshot Treffpunkt: "Landeplatz Tristacher See" (Demo-Platzhalter, existiert nicht)
  → "Landeplatz Touch Heaven", neu aufgenommen. Flugpass-Crop aus demselben Shot.
- Seite 2: totes ~40mm-Loch vor dem Footer geschlossen (Phones 40→46mm, Sektionsabstände
  vergrößert, CTA-Padding erhöht). Seite 1: review-block ohne space-between (gleichmäßige
  Abstände), Hinweiszeile unten gepinnt.

## Verifiziert (2026-07-12)

- QR Google → `https://g.page/r/CaGNb8TkNHIKEAE/review` (decodiert getestet)
- QR Tripadvisor → Attraction-Review-Seite d12963049 (decodiert getestet)
- QR WhatsApp → `wa.me/436767293888` mit Prefill (decodiert getestet)
- Layout per Playwright geprüft: 2 Seiten im DOM je 794x1123px, PDF exakt 2 Seiten A4
  (nach den Fixes erneut geprüft, Footer sitzt auf beiden Seiten im Blatt)
- Copy gegen Humanizer-Regeln gescannt (kein Em-Dash, keine AI-Marker-Muster)
- Preise/Flugzeiten aus `lib/schema.ts` + `messages/de.json` (Premium €190 / 30-45 Min inkl. Media, Thermik ab €250 / 45-90 Min, Gutschein ab €150, 3 Jahre gültig)
