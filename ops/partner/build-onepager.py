# -*- coding: utf-8 -*-
"""Baut das Partner-Paket als Druck-PDF: 1 A4-Seite pro Haus.

Inhalt pro Seite (aus PARTNER-PAKET.md): Aufsteller-Block, haus-eigener
QR-Code (zaehlbar via utm_campaign), Gaestenachricht DE/NL zum
Copy-Pasten, Rezeptions-Satz, Kontakt. Praemie nur als Kennenlernflug-
Zeile (das €10-15-Modell ist laut PARTNER-PAKET.md noch Annahme und
gehoert nicht auf Papier).

Aufruf:  python ops/partner/build-onepager.py
Output:  ops/partner/KOFLY-Partner-Paket.pdf
"""
import base64
import io
import os
import subprocess
import sys

import segno

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))

BASE = "https://gleitschirm-tandemflug.com/de/urlaub?utm_source=partner&utm_medium=referral&utm_campaign="
NL_BASE = "https://gleitschirm-tandemflug.com/nl/urlaub?utm_source=partner&utm_medium=referral&utm_campaign="

HAEUSER = [
    ("winklers-dolomitenhof", "Winklers Dolomitenhof", "Tristach"),
    ("winklers-moarhof", "Winklers Hotel Moarhof", "Lienz"),
    ("camping-falken", "Camping Falken", "Lienz"),
    ("camping-seewiese", "Camping Seewiese", "Tristach"),
    ("hotel-gribelehof", "Hotel Gribelehof", "Lienz"),
    ("familienhotel-moosalm", "Familienhotel Moosalm", "Lienz"),
    ("parkhotel-tristachersee", "Parkhotel Tristachersee", "Tristach"),
    ("dolomitengolf-spa", "Dolomitengolf Hotel & Spa", "Lavant"),
    ("grandhotel-lienz", "Grandhotel Lienz", "Lienz"),
    ("hotel-traube", "Vergeiner's Hotel Traube", "Lienz"),
    ("hotel-outside", "Hotel Outside", "Matrei"),
    ("sporthotel-sillian", "Dolomiten Residenz Sporthotel Sillian", "Sillian"),
]


def qr_data_uri(url: str) -> str:
    qr = segno.make(url, error="h")
    buf = io.BytesIO()
    qr.save(buf, kind="png", scale=10, border=2)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def file_data_uri(path: str) -> str:
    ext = os.path.splitext(path)[1].lstrip(".")
    with open(path, "rb") as f:
        return f"data:image/{ext};base64," + base64.b64encode(f.read()).decode()


PAGE_TMPL = """
<div class="page">
  <div class="head">
    <img class="logo" src="{LOGO}" alt="KOFLY">
    <div>
      <div class="brand">KOFLY · Gleitschirm-Tandemflug.com</div>
      <div class="for">Partner-Info f&uuml;r <strong>{HAUS}</strong>, {ORT}</div>
    </div>
  </div>

  <h1>Osttirol von oben</h1>
  <p class="sub">Tandem-Gleitschirmflug &uuml;ber den Lienzer Dolomiten<br>
  Ohne Vorkenntnisse &middot; ab &euro;150 &middot; Bezahlung erst nach dem Flug</p>

  <div class="qrbox">
    <img class="qr" src="{QR}" alt="QR-Code">
    <div class="qrtext">
      <strong>Sag uns, wie lange du hier bist.<br>Wir finden deinen sch&ouml;nsten Flugtag.</strong>
      <p>QR scannen &rarr; WhatsApp-Anfrage in 30 Sekunden.<br>
      Dieser Code ist euer Haus-Code: Wir sehen, welche G&auml;ste von euch kommen.</p>
    </div>
  </div>

  <h2>F&uuml;r eure G&auml;ste-Mail (einfach kopieren)</h2>
  <div class="copy">
    <p class="lang">Deutsch</p>
    <p>Noch auf der Suche nach eurem Osttirol-Highlight? Das Team von KOFLY fliegt mit euch im Tandem-Gleitschirm &uuml;ber die Lienzer Dolomiten. Ohne Vorkenntnisse, ab &euro;150, bezahlt wird erst nach dem Flug. Sagt ihnen einfach, wie lange ihr da seid: Sie finden den sch&ouml;nsten Flugtag in eurem Urlaub.<br>
    <span class="link">{LINK_DE}</span></p>
    <p class="lang">Nederlands</p>
    <p>Nog op zoek naar jullie vakantiehighlight in Oost-Tirol? Het team van KOFLY vliegt met jullie in een tandem-paraglider boven de Lienzer Dolomieten. Geen ervaring nodig, vanaf &euro;150, betalen pas na de vlucht. Vertel ze gewoon wanneer jullie er zijn: zij vinden de mooiste vliegdag tijdens jullie vakantie.<br>
    <span class="link">{LINK_NL}</span></p>
  </div>

  <h2>F&uuml;r die Rezeption (10 Sekunden)</h2>
  <p class="quote">&bdquo;Wenn ihr noch ein Highlight sucht: Unser Tandempilot findet den sch&ouml;nsten Flugtag w&auml;hrend eures Aufenthalts. Einfach den QR-Code scannen, die melden sich per WhatsApp.&ldquo;</p>

  <div class="foot">
    <div>Nach 5 vermittelten G&auml;sten laden wir jemanden aus eurem Team zum Kennenlernflug ein.</div>
    <div class="contact">Daniel Kofler &middot; +43&nbsp;676&nbsp;7293&nbsp;888 &middot; gleitschirm-tandemflug.com</div>
  </div>
</div>
"""

CSS = """
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Segoe UI", Arial, sans-serif; color: #16323f; }
  .page { width: 210mm; height: 296mm; padding: 16mm 18mm; page-break-after: always; position: relative; }
  .head { display: flex; align-items: center; gap: 5mm; border-bottom: 0.6mm solid #16323f; padding-bottom: 4mm; margin-bottom: 8mm; }
  .logo { width: 14mm; height: 14mm; }
  .brand { font-weight: 700; font-size: 12pt; }
  .for { font-size: 10pt; color: #4a6572; }
  h1 { font-size: 26pt; margin-bottom: 2mm; }
  .sub { font-size: 12pt; color: #4a6572; margin-bottom: 8mm; line-height: 1.5; }
  .qrbox { display: flex; gap: 8mm; align-items: center; background: #f0f5f7; border-radius: 3mm; padding: 6mm; margin-bottom: 8mm; }
  .qr { width: 42mm; height: 42mm; }
  .qrtext strong { font-size: 13pt; display: block; margin-bottom: 3mm; }
  .qrtext p { font-size: 10pt; color: #4a6572; line-height: 1.5; }
  h2 { font-size: 12pt; margin-bottom: 3mm; }
  .copy { border: 0.4mm solid #c3d2d9; border-radius: 3mm; padding: 5mm; margin-bottom: 7mm; }
  .copy p { font-size: 9.5pt; line-height: 1.55; margin-bottom: 3mm; }
  .copy .lang { font-weight: 700; font-size: 8.5pt; text-transform: uppercase; letter-spacing: 0.5mm; color: #4a6572; margin-bottom: 1mm; }
  .link { color: #1a6e8e; word-break: break-all; font-size: 8.5pt; }
  .quote { font-size: 11pt; font-style: italic; color: #16323f; margin-bottom: 10mm; line-height: 1.5; }
  .foot { position: absolute; bottom: 14mm; left: 18mm; right: 18mm; border-top: 0.4mm solid #c3d2d9; padding-top: 4mm; font-size: 9.5pt; color: #4a6572; }
  .foot .contact { margin-top: 2mm; font-weight: 700; color: #16323f; }
</style>
"""


def main() -> None:
    logo = file_data_uri(os.path.join(REPO, "public", "icon-512.png"))
    pages = []
    for slug, haus, ort in HAEUSER:
        pages.append(
            PAGE_TMPL.replace("{LOGO}", logo)
            .replace("{HAUS}", haus)
            .replace("{ORT}", ort)
            .replace("{QR}", qr_data_uri(BASE + slug))
            .replace("{LINK_DE}", BASE + slug)
            .replace("{LINK_NL}", NL_BASE + slug)
        )

    html = f"<!doctype html><html><head><meta charset='utf-8'>{CSS}</head><body>{''.join(pages)}</body></html>"
    out_html = os.path.join(HERE, "_onepager.html")
    with open(out_html, "w", encoding="utf-8") as f:
        f.write(html)

    out_pdf = os.path.join(HERE, "KOFLY-Partner-Paket.pdf")
    browser = find_browser()
    subprocess.run(
        [
            browser,
            "--headless",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={out_pdf}",
            "file:///" + out_html.replace(os.sep, "/"),
        ],
        check=True,
        timeout=120,
    )
    print("OK:", out_pdf)


def find_browser() -> str:
    candidates = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    sys.exit("Kein Chrome/Edge gefunden.")


if __name__ == "__main__":
    main()
