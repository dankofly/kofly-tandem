# QR-Batch fuer das Partner-Paket (PARTNER-PAKET.md, Baustein 1).
# Ein QR pro Haus auf den DE-Partner-Link, damit Scans pro Haus zaehlbar sind.
# Aufruf: python ops/partner/make-qr.py  -> PNGs nach ops/partner/qr/
import os

import qrcode

BASE = "https://gleitschirm-tandemflug.com/de/urlaub?utm_source=partner&utm_medium=referral&utm_campaign="

HAEUSER = [
    ("winklers-dolomitenhof", "Winklers Dolomitenhof, Tristach"),
    ("winklers-moarhof", "Winklers Hotel Moarhof, Lienz"),
    ("camping-falken", "Camping Falken, Lienz"),
    ("camping-seewiese", "Camping Seewiese, Tristach"),
    ("hotel-gribelehof", "Hotel Gribelehof, Lienz"),
    ("familienhotel-moosalm", "Familienhotel Moosalm, Lienz"),
    ("parkhotel-tristachersee", "Parkhotel Tristachersee, Tristach"),
    ("dolomitengolf-spa", "Dolomitengolf Hotel & Spa, Lavant"),
    ("grandhotel-lienz", "Grandhotel Lienz"),
    ("hotel-traube", "Vergeiner's Hotel Traube, Lienz"),
    ("hotel-outside", "Hotel Outside, Matrei"),
    ("sporthotel-sillian", "Dolomiten Residenz Sporthotel Sillian"),
]

OUT = os.path.join(os.path.dirname(__file__), "qr")
os.makedirs(OUT, exist_ok=True)

for slug, name in HAEUSER:
    # Hohe Fehlerkorrektur: QR wird gedruckt (Aufsteller, Rezeption),
    # muss auch leicht beschaedigt/spiegelnd noch scannen.
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=12, border=4)
    qr.add_data(BASE + slug)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    path = os.path.join(OUT, f"qr-{slug}.png")
    img.save(path)
    print(f"{path}  ->  {BASE}{slug}  ({name})")
