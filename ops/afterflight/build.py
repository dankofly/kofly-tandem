# -*- coding: utf-8 -*-
"""Baut die KOFLY Afterflight-Beilage (PDF) aus template.html.

QR-Codes werden mit segno generiert und als Data-URIs eingebettet,
Hero-Foto + Logo kommen aus public/. Rendering via headless Chrome/Edge.

Aufruf:  python build.py
Output:  KOFLY-Afterflight-Beilage.pdf
"""
import base64
import io
import os
import subprocess
import sys

import segno

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))

QR_TARGETS = {
    "QR_GOOGLE": "https://g.page/r/CaGNb8TkNHIKEAE/review",
    "QR_TRIPADVISOR": "https://www.tripadvisor.com/Attraction_Review-g190432-d12963049-Reviews-Gleitschirm_Tandemflug-Lienz_Tirol_Austrian_Alps.html",
    "QR_WHATSAPP": "https://wa.me/436767293888?text=Hallo%20KOFLY!%20Ich%20m%C3%B6chte%20einen%20Tandemflug%20anfragen.",
}

IMAGES = {
    "HERO_IMG": os.path.join(REPO, "public", "images", "tandemflug-zettersfeld-hero.webp"),
    "LOGO_IMG": os.path.join(REPO, "public", "icon-512.png"),
    # Original-Screens der Tandemify-App (booking.kofly.at/p/demo, via Playwright)
    "SHOT_FLUGPASS": os.path.join(HERE, "screens", "crop_flugpass.png"),
    "SHOT_TREFFPUNKT": os.path.join(HERE, "screens", "crop_treffpunkt.png"),
    "SHOT_AFTER": os.path.join(HERE, "screens", "crop_after.png"),
}


def qr_data_uri(content: str, dark: str = "#142832") -> str:
    qr = segno.make(content, error="m")
    buf = io.BytesIO()
    qr.save(buf, kind="png", scale=12, border=2, dark=dark, light="#ffffff")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def file_data_uri(path: str) -> str:
    mime = "image/webp" if path.endswith(".webp") else "image/png"
    with open(path, "rb") as f:
        return f"data:{mime};base64," + base64.b64encode(f.read()).decode()


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


def main() -> None:
    with open(os.path.join(HERE, "template.html"), encoding="utf-8") as f:
        html = f.read()

    for key, url in QR_TARGETS.items():
        html = html.replace("{{" + key + "}}", qr_data_uri(url))
    for key, path in IMAGES.items():
        html = html.replace("{{" + key + "}}", file_data_uri(path))

    out_html = os.path.join(HERE, "_rendered.html")
    with open(out_html, "w", encoding="utf-8") as f:
        f.write(html)

    out_pdf = os.path.join(HERE, "KOFLY-Afterflight-Beilage.pdf")
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


if __name__ == "__main__":
    main()
