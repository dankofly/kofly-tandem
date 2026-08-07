---
name: KOFLY Gleitschirm-Tandemflug
description: Tandem-Paragleiten im Airpark Lienzer Dolomiten, Osttirol
colors:
  accent: "oklch(0.68 0.2 40)"
  accent-hover: "oklch(0.74 0.2 40)"
  accent-deep: "oklch(0.62 0.2 40)"
  navy-abyss: "#0a1a22"
  navy-deep: "#142832"
  navy-slate: "#1e3a48"
  navy-steel: "#2d4f5f"
  navy-haze: "#89b4c8"
  navy-mist: "#edf4f8"
  paper: "#f8fafb"
  paper-shade: "#eef3f6"
  ink: "#0a1a22"
  ink-body: "#355b6d"
  sky-glare: "#89c4e1"
  sky-deep: "#4682a9"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.875rem, 5vw, 3rem)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 300
    lineHeight: 1.625
  label:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.2em"
rounded:
  none: "0"
  sm: "0.125rem"
  md: "0.5rem"
  lg: "0.75rem"
  xl: "1rem"
  full: "9999px"
spacing:
  gutter: "1.5rem"
  page: "72rem"
  cta: "42rem"
  measure: "56ch"
  rhythm-tight: "3rem"
  rhythm-base: "4rem"
  rhythm-loose: "5rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "1rem 2rem"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "1rem 2rem"
  button-header:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0.625rem 1.25rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    rounded: "{rounded.none}"
    padding: "1rem 2rem"
  card-glass:
    backgroundColor: "{colors.navy-slate}"
    textColor: "{colors.navy-haze}"
    rounded: "{rounded.none}"
    padding: "1.5rem"
  input-text:
    backgroundColor: "{colors.navy-deep}"
    textColor: "{colors.navy-mist}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1rem"
---

# Design System: KOFLY Gleitschirm-Tandemflug

## Overview

**Creative North Star: "Das Hochgebirgs-Fenster"**

Das Interface ist der Rahmen, nicht das Bild. Wer hierherkommt, will zwei Dinge wissen: wie es dort oben aussieht, und ob er dem Menschen am anderen Ende der Leine trauen kann. Beides beantwortet das Panorama besser als jedes Chrom. Also tritt die Oberfläche zurück. Tiefes Navy als Dämmerungshimmel, viel Luft, und ein einziger warmer Ton, der nur dort auftaucht, wo etwas passiert.

Die Seite ist bewusst leise gebaut, und das lässt sich zählen. `font-light` ist mit 283 Vorkommen das häufigste Schriftgewicht im Projekt, deutlich vor `font-medium` (208) und `font-bold` (203). Tiefe entsteht durch Glimmen statt durch Schlagschatten: das gesamte System kennt genau einen konventionellen Schatten. Kanten sind eckig, wo andere abrunden würden, allen voran der Primärbutton. Nichts davon ist Zufall, und nichts davon soll sich zurückdrängen lassen.

Der Ton ist ruhig, weil das Produkt es verlangt. Ein Anbieter, der Menschen in 2.220 Metern Höhe an einen Schirm hängt, gewinnt nicht durch Lautstärke. Er gewinnt durch Verlässlichkeit, und ein System, in dem jede Kante fluchtet und jeder Abstand aus drei erlaubten Stufen stammt, kommuniziert genau das, bevor ein einziges Wort gelesen wird.

**Key Characteristics:**
- Ein Akzent, sparsam eingesetzt, immer handlungsbezogen
- Licht statt Schatten
- Eine Seitenbreite, ein Textmaß, drei vertikale Abstände
- Themes über Variablen, nie über Utility-Klassen
- Eckig als Grundhaltung, Radius als begründete Ausnahme

## Colors

Ein warmer Ton auf kühlem Grund. Das Verhältnis ist die Aussage, nicht die Menge.

### Primary
- **Schirm-Orange** (`{colors.accent}`): Die Markenfarbe, identisch mit der Buchungsstrecke booking.kofly.at, dort als `--primary` geführt. Buttons, Akzentwörter in Überschriften, Trennlinien, Glimmen, Fokusring, Textmarkierung. Nie als großflächiger Hintergrund, nie für Fließtext.
- **Schirm-Orange hell** (`{colors.accent-hover}`): Ausschließlich Hover. Kommt an 45 Stellen als `hover:bg-` und an 118 als `hover:text-` vor, sonst nirgends.
- **Schirm-Orange tief** (`{colors.accent-deep}`): Reserve für Tiefenwirkung. Derzeit unbenutzt, bewusst vorgehalten statt gelöscht.

### Neutral
- **Navy Abgrund** (`{colors.navy-abyss}`): Grundfläche im Dark-Theme, der Dämmerungshimmel.
- **Navy Tiefe** (`{colors.navy-deep}`): Abgesetzte Bänder, Eingabefelder, Kartenflächen.
- **Navy Schiefer** (`{colors.navy-slate}`): Die dritte Ebene, Milchglas-Grundton.
- **Navy Stahl** (`{colors.navy-steel}`): Rahmen und Trennlinien im Dark-Theme.
- **Himmeldunst** (`{colors.navy-haze}`): Fließtext im Dark-Theme. Kühl genug, um das Orange nicht anzugreifen.
- **Papier** (`{colors.paper}`) und **Papier Schatten** (`{colors.paper-shade}`): Grundflächen im Light-Theme.
- **Tinte Körper** (`{colors.ink-body}`): Fließtext im Light-Theme.

### Tertiary
- **Himmelsblendung** (`{colors.sky-glare}`) und **Himmel Tiefe** (`{colors.sky-deep}`): Das kühle Gegengewicht. Glimmen an nicht handlungsbezogenen Stellen, Glaskanten, dekorative Orbs. Nie für Handlungen, das ist dem Akzent vorbehalten.

### Named Rules

**Die Ein-Quellen-Regel.** Die Markenfarbe steht an genau einer Stelle: dem Token-Block in `app/globals.css`. Glow, Selection und Fokusring leiten sie über `var(--accent-500-rgb)` ab, sie wiederholen sie nicht. Wer irgendwo ein Orange als Hex oder rgba tippt, bricht das System. Diese Regel entstand aus einem echten Vorfall: Nach dem Wechsel auf die Markenfarbe trugen 16 Stellen weiterhin das alte `#e86830`, und Glimmen und Akzent waren monatelang zwei verschiedene Orange, ohne dass es jemand bemerkte.

**Die Sparsamkeits-Regel.** Der Akzent liegt auf höchstens einem Zehntel einer Ansicht. Seine Seltenheit ist der Grund, warum er wirkt. Eine Seite, auf der alles orange ist, hat keinen Akzent mehr, sondern einen Hintergrund.

**Die Handlungs-Regel.** Orange markiert, wo etwas passiert. Blau markiert, wo etwas ist. Wer eine dekorative Fläche orange einfärbt, verbraucht Aufmerksamkeit, die dem nächsten Button fehlt.

*Bewusst getragen:* Im Light-Theme erreicht der Akzent 2,98:1 auf `{colors.paper}` und 3,12:1 mit weißer Schrift auf dem Button, also unterhalb der 4,5:1 von WCAG AA. Das ist eine Markenentscheidung zugunsten der Konsistenz mit booking.kofly.at, getroffen am 2026-08-07, kein Versehen. Im Dark-Theme liegt derselbe Ton bei 5,68:1 und erfüllt AA. Wer die Entscheidung drehen will, braucht ungefähr `#c04113` (hell 5,01, Weiß darauf 5,24) und ein sichtbar dunkleres Gesamtbild.

## Typography

**Display Font:** Inter (mit `system-ui`, `-apple-system`, `sans-serif`)
**Body Font:** Inter, dieselbe Familie
**Label Font:** Inter, unterschieden nur durch Laufweite und Versalien

**Character:** Eine einzige Familie über alle Rollen, differenziert durch Gewicht und Laufweite statt durch Familienwechsel. Das ist eine Entscheidung für Ruhe. Die Spannung entsteht zwischen `font-light` im Fließtext und `font-black` in der Display-Zeile, nicht zwischen zwei Schriftcharakteren.

### Hierarchy
- **Display** (900, `clamp(1.875rem, 5vw, 3rem)`, 1.1, `-0.025em`): Die H1 jeder Seite. Das Akzentwort darin trägt die Markenfarbe.
- **Headline** (700, 1.875rem, 1.2, `-0.02em`): Sektions-Überschriften. Darunter immer eine Trennlinie.
- **Title** (600, 1.125rem, 1.4): Kartenüberschriften, Rasterelemente.
- **Body** (300, 1rem, 1.625): Fließtext, begrenzt auf `{spacing.measure}`. Gemessen ergibt das 64 bis 76 Zeichen pro Zeile.
- **Label** (500, 0.75rem, `0.2em`, Versalien): Overlines über Überschriften, Buttons, Metadaten. Die weite Laufweite ist das Erkennungsmerkmal des Systems.

### Named Rules

**Die Maß-Regel.** Fließtext läuft nie über 75 Zeichen. Das Maß liegt als `--measure` an einer Stelle und wird über `.container-page :is(p, ul, ol, blockquote, dl)` durchgesetzt, nicht pro Element gesetzt. Raster, Tabellen und Medien sind ausdrücklich ausgenommen, sie brauchen die Breite.

**Die Leise-Regel.** Fließtext ist `font-light`. Gewicht ist ein Betonungsmittel, kein Grundzustand. Wer einen ganzen Absatz auf `font-medium` hebt, hat nichts betont.

## Layout

Das System kennt **eine** Inhaltsbreite. `container-page` und `container-wide` sind beide `{spacing.page}` breit und unterscheiden sich nur darin, dass `container-page` sein Fließtextmaß mitbringt. Der Gutter ist mit `{spacing.gutter}` auf allen Viewports identisch, es gibt keine Mobile-Sonderregel.

Die dritte Stufe `container-cta` (`{spacing.cta}`) ist das zentrierte Abschlussband am Seitenende, an 17 Stellen identisch aufgebaut. Sie ist eine bewusste Verengung, keine Restgröße.

Vertikal existieren **drei Stufen**: gedrängt, Standard, großzügig. Ausgezählt am 2026-08-07 treten sie in sechs Ketten auf, weil drei Marketing-Module einen weicheren Einstieg über `sm:` nehmen:

| Kette | Vorkommen | Stufe |
|---|---|---|
| `py-16 lg:py-24` | 85 | Standard |
| `py-20 lg:py-28` | 24 | großzügig |
| `py-12 lg:py-16` | 10 | gedrängt |
| `py-14 sm:py-16 lg:py-24` | 3 | Standard, weicher Einstieg |
| `py-12 sm:py-16 lg:py-24` | 1 | Standard, flacher Einstieg |
| `py-8 sm:py-10 lg:py-14` | 1 | Statistik-Band, bewusst schmal |

Responsive Arbeit passiert praktisch nur an zwei Haltepunkten: `sm` (640px, 464 Vorkommen) und `lg` (1024px, 249). `md` ist mit zwei Vorkommen faktisch unbenutzt und sollte es bleiben.

### Named Rules

**Die Rahmen-Regel.** Ein Modul mit sichtbarer Kante, also Rahmen oder eigener Hintergrund, muss diese Kante auf der Seitenbreite ziehen. Ein Modul ohne Kante, oder eines mit Vollbreiten-Hintergrundband, darf seine Textspalte frei verschmälern. Genau diese Unterscheidung erklärt, warum FAQ mit schmalerer Spalte korrekt ist und die Regional-Box es nicht war.

**Die Drei-Stufen-Regel.** Sektionen kennen drei vertikale Stufen und die sechs oben aufgezählten Ketten. Eine siebte ist ein Fehler, keine Nuance. Der Check in `consistency-check.mjs` führt die Liste; wer eine Kette ergänzt, muss sie dort begründen.

**Die Container-Regel.** Inhaltsbreiten werden nie inline gesetzt. `max-w-*` zusammen mit `mx-auto` und `px-*` im JSX ist verboten. Vor der Vereinheitlichung standen 153 solcher Wrapper in 10 Varianten im Code, mit dem Ergebnis, dass Header, Inhalt und Footer vertikal nicht fluchteten.

## Elevation & Depth

Dieses System arbeitet mit **Licht, nicht mit Schatten**. Erhebung wird durch ein farbiges Glimmen ausgedrückt, das nur als Antwort auf eine Handlung erscheint, und durch tonale Schichtung der drei Navy-Stufen. Ein einziger konventioneller Schlagschatten existiert im gesamten Projekt.

Der Grund ist inhaltlich: Ein Schatten setzt eine Lichtquelle über der Fläche voraus und erzeugt Materialität. Ein Glimmen setzt Licht *in* der Fläche voraus und erzeugt Atmosphäre. Für eine Seite, die von Dämmerung, Höhe und Luft handelt, ist das zweite die richtige Metapher.

### Shadow Vocabulary
- **Button-Glimmen** (`0 0 30px rgb(var(--accent-500-rgb) / 0.4)`): Nur im Hover des Primärbuttons.
- **Karten-Glimmen** (`0 0 60px var(--glow-card)`, kombiniert mit `0 20px 40px rgba(0,0,0,0.1)`): Flugkarten im Hover. Die einzige Stelle, an der Glimmen und Schatten zusammen auftreten.
- **Trennlinien-Glimmen** (`0 0 16px rgb(var(--accent-500-rgb) / 0.5)`): Unter jeder Sektions-Trennlinie.
- **Ambient-Orbs** (`filter: blur(60px)`, ab 640px `blur(80px)`): Großflächige, unscharfe Farbkreise im Hintergrund. Dekorativ, `pointer-events: none`.
- **Flacher Schatten** (`0 2px 12px rgba(0, 0, 0, 0.08)`): Der einzige konventionelle Schatten im System.

### Named Rules

**Die Glimmen-Regel.** Tiefe entsteht durch Licht. Ein Schlagschatten braucht eine funktionale Begründung, die über Dekoration hinausgeht, sonst gehört er nicht ins System.

**Die Ruhe-Regel.** Erhebung ist ein Zustand, kein Grundzustand. Flächen liegen im Ruhezustand flach. Glimmen erscheint bei Hover oder Fokus und verschwindet wieder.

## Shapes

Die Grundhaltung ist **eckig**. Der Primärbutton hat keinen Radius, `glass-card` hat keinen Radius. Das ist kein Versäumnis, sondern das Gegengewicht zur weichen Bildsprache aus Wolken und Panorama: Wenn das Bild rund ist, darf das Interface Kante zeigen.

Radien treten als begründete Ausnahme auf, nicht als Grundeinstellung. Der Header-CTA trägt `{rounded.md}`, weil er in einer gerundeten Leiste sitzt. Medienkacheln tragen `{rounded.lg}` bis `{rounded.xl}`, weil sie Bildinhalt rahmen. `{rounded.full}` ist Zählpunkten, Statusindikatoren und Sprachumschaltern vorbehalten.

Kanten sind durchgehend 1px und tragen eine der `edge`-Stufen, nie eine Rohfarbe. Der Milchglas-Effekt (`backdrop-filter: blur(20px)` plus 1px Kante) ist das wiederkehrende Materialmotiv des Systems.

### Named Rules

**Die Kanten-Regel.** Eckig ist der Grundzustand. Ein Radius braucht eine Begründung aus dem Kontext, entweder gerundete Umgebung oder gerahmter Bildinhalt.

## Components

### Buttons
- **Shape:** Der Primärbutton ist scharfkantig (`{rounded.none}`). Der Header-CTA ist leicht gerundet (`{rounded.md}`).
- **Primary:** Markenfarbe als Fläche, weiße Versalien in Label-Typografie, Innenabstand `1rem 2rem`. Trägt immer `cta-lift` und `btn-glow`.
- **Hover / Focus:** Hebt sich um 2px (`translateY(-2px)`) und bekommt das Button-Glimmen. Übergang 0.3s mit dem Standard-Easing. Fokus über den globalen `:focus-visible`-Ring in der Markenfarbe, 2px, 2px Versatz.
- **Header-CTA:** Kompakter (`0.625rem 1.25rem`), 13px, `font-bold`, gerundet. Gleiche Farbe, gleiche Hover-Logik ohne Anhebung.
- **Ghost:** Transparent mit Akzent-Text und Kante in `edge`, gleiche Maße wie Primary. Steht immer neben einem Primary, nie allein.

### Cards / Containers
- **Corner Style:** Scharfkantig. Nur bildtragende Karten runden ab.
- **Background:** Milchglas über `--glass-bg`, also halbtransparentes Navy im Dark-Theme und halbtransparentes Weiß im Light-Theme.
- **Shadow Strategy:** Flach im Ruhezustand. `flight-card` hebt sich im Hover um 4px und bekommt Karten-Glimmen.
- **Border:** 1px in `--glass-border`.
- **Internal Padding:** `1.5rem` mobil, `2rem` bis `3rem` auf großen Viewports.

### Inputs / Fields
- **Style:** 1px Kante in `--border-input`, Fläche `--bg-input` mit 40 Prozent Deckung, scharfkantig.
- **Focus:** Akzentring plus weiches Akzent-Glimmen (`0 0 0 3px` bei 0.1 Deckung, dazu `0 0 16px` bei 0.06).
- **Error:** Kante in Akzentfarbe mit `error-shake`.
- **Label:** Immer über dem Feld, nie als Platzhalter.

### Navigation
- **Style:** Versalien, `13px`, `font-semibold`, weite Laufweite. Unterstreichung wächst im Hover von der Mitte (`nav-underline`).
- **Mobile:** Der Header schrumpft auf Logo, KI-Knopf und Burger. Zusätzlich liegt am unteren Rand eine feste Buchungsleiste, die auf Seiten mit genau einem gewollten Klick ausgeblendet wird.

### Section Divider
Ein 48 mal 2 Pixel großer Balken in der Markenfarbe mit Glimmen, der unter jeder Sektions-Überschrift steht. Er folgt der Ausrichtung seiner Überschrift: zentriert unter zentrierten, linksbündig (`!mx-0`) unter linksbündigen. Das ist das am häufigsten wiederholte Erkennungsmerkmal des Systems.

## Do's and Don'ts

### Do:
- **Do** jede Inhaltssektion in `container-page` setzen. Eine Seitenbreite, eine Kante.
- **Do** Fließtext auf `{spacing.measure}` begrenzen und Raster davon ausnehmen.
- **Do** genau drei vertikale Sektions-Abstände verwenden.
- **Do** Tiefe über Glimmen lösen und Erhebung an einen Zustand binden.
- **Do** dieselbe Handlung überall gleich benennen. Der Kanon ist "Termin anfragen", englisch "Request an appointment", niederländisch "Afspraak aanvragen". Produktnamen wie "Premiumflug anfragen" dürfen abweichen, Handlungen nicht.
- **Do** neue Farben als Token in `app/globals.css` anlegen, mit Kontrastwert im Kommentar.
- **Do** jede Animation gegen `prefers-reduced-motion` absichern.

### Don't:
- **Don't** `max-w-*` mit `mx-auto` inline schreiben. Dafür gibt es die Container-Klassen.
- **Don't** eine `dark:`-Klasse verwenden. Themes laufen ausschließlich über `[data-theme]` und CSS-Variablen. Das Projekt enthält null solcher Klassen, und das ist der Zielzustand.
- **Don't** ein Orange als Hex oder rgba hardcodieren. Alles leitet von `--accent-500-rgb` ab.
- **Don't** dem Primärbutton einen Radius geben.
- **Don't** eine vierte Abstandsstufe erfinden.
- **Don't** `md:` für neue Arbeit verwenden. Das System bricht bei `sm` und `lg`.
- **Don't** Akzentfarbe für dekorative Flächen einsetzen. Sie gehört Handlungen.
- **Don't** eine Regel entfernen, weil ein Test rot ist. Erst prüfen, ob der Code falsch liegt.

---

*Erzeugt aus dem Bestand, nicht erfunden. Alle Zahlen sind gemessen. Die geprüften Regeln liegen als Guards in `scripts/seo-verify/`. Maschinenlesbare Ergänzungen stehen in `.impeccable/design.json`.*
