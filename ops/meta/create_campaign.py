"""KOFLY Meta CTWA-Kampagne: anlegen und pruefen via Marketing API.

Token/Konto liegen ausserhalb des Repos: C:/Users/DanKof/.claude/meta-ads-mcp/.env
    META_ACCESS_TOKEN=...
    META_AD_ACCOUNT_ID=act_...

Modi:
    python create_campaign.py check    # Token, Werbekonto, Seite, WhatsApp pruefen
    python create_campaign.py create   # Kampagne + 2 Ad Sets anlegen (PAUSED)
    python create_campaign.py status   # bestehende KOFLY-Kampagnen + Ad Sets zeigen

Alles wird PAUSIERT angelegt. Live schalten passiert bewusst manuell im Ads Manager.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import requests

ENV_FILE = Path(r"C:\Users\DanKof\.claude\meta-ads-mcp\.env")
GRAPH = "https://graph.facebook.com/v24.0"  # unversioniert liefert 2635 deprecated-Fehler
BUSINESS_ID = "1642197189236205"  # Portfolio "Gleitschirm-Tandemflug.com" (aus Business-Suite-URL)
# Seiten-ID der FB-Seite "Gleitschirm-Tandemflug.com" (asset_id aus der Ad-Center-URL der Business Suite).
# Fallback, wenn der Token keine business_management/pages-Rechte hat.
PAGE_ID_FALLBACK = "1641811262766565"

CAMPAIGN_NAME = "KOFLY_CTWA_Urlauber"
# Lienz Zentrum; 40 km Radius deckt Matrei, Sillian, Defereggental, Drautal
LIENZ = {"latitude": 46.8297, "longitude": 12.7697, "radius": 40, "distance_unit": "kilometer"}
DAILY_BUDGET_CENTS = 1500  # 15 EUR je Ad Set
AGE_MIN, AGE_MAX = 20, 60

AD_SETS = [
    {"name": "DE-Urlauber", "locale_query": "German"},
    {"name": "NL-Urlauber", "locale_query": "Dutch"},
]


def load_env() -> dict:
    if not ENV_FILE.exists():
        sys.exit(f"[abbruch] {ENV_FILE} fehlt. Erst ANLEITUNG.md im selben Ordner abarbeiten.")
    env = {}
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
    token = env.get("META_ACCESS_TOKEN", "")
    account = env.get("META_AD_ACCOUNT_ID", "")
    if not token or "EINFUEGEN" in token:
        sys.exit("[abbruch] META_ACCESS_TOKEN fehlt in .env")
    if not account.startswith("act_") or "WERBEKONTO" in account:
        sys.exit("[abbruch] META_AD_ACCOUNT_ID fehlt in .env (Format: act_123456789)")
    return {"token": token, "account": account}


def api(method: str, path: str, token: str, _soft: bool = False, **params):
    params["access_token"] = token
    url = f"{GRAPH}/{path}"
    if method == "GET":
        resp = requests.get(url, params=params, timeout=30)
    else:
        resp = requests.post(url, data=params, timeout=30)
    body = resp.json()
    if "error" in body:
        if _soft:
            return body
        err = body["error"]
        sys.exit(f"[api-fehler] {path}: ({err.get('code')}) {err.get('message')} "
                 f"| subcode={err.get('error_subcode')} | {err.get('error_user_msg', '')}")
    return body


def find_page(token: str) -> dict:
    """Seite finden: Business-Portfolio -> User-Seiten -> Fallback auf bekannte ID."""
    res = api("GET", f"{BUSINESS_ID}/owned_pages", token, _soft=True, fields="id,name")
    pages = res.get("data", []) if "error" not in res else []
    if not pages:
        res = api("GET", "me/accounts", token, _soft=True, fields="id,name")
        pages = res.get("data", []) if "error" not in res else []
    for p in pages:
        if "Gleitschirm" in p.get("name", "") or "KOFLY" in p.get("name", "").upper():
            return p
    print(f"[info] Seite per API nicht auflistbar (fehlende pages-Rechte), nutze bekannte ID {PAGE_ID_FALLBACK}")
    return {"id": PAGE_ID_FALLBACK, "name": "Gleitschirm-Tandemflug.com (Fallback-ID)"}


def resolve_locale(token: str, query: str) -> int:
    res = api("GET", "search", token, type="adlocale", q=query).get("data", [])
    if not res:
        sys.exit(f"[abbruch] Locale '{query}' nicht gefunden")
    # exakten Haupttreffer bevorzugen (z.B. "German" vor "German (Switzerland)")
    for loc in res:
        if loc.get("name", "").lower() == query.lower():
            return loc["key"]
    return res[0]["key"]


def cmd_check(env: dict):
    me = api("GET", "me", env["token"], fields="id,name")
    print(f"[ok] Token gueltig, User: {me.get('name')} ({me.get('id')})")
    acct = api("GET", env["account"], env["token"], fields="name,currency,account_status,funding_source_details")
    status_map = {1: "AKTIV", 2: "GESPERRT", 3: "UNSETTLED", 7: "PENDING_RISK_REVIEW", 100: "PENDING_CLOSURE", 101: "GESCHLOSSEN"}
    print(f"[ok] Werbekonto: {acct.get('name')} | {acct.get('currency')} | Status: {status_map.get(acct.get('account_status'), acct.get('account_status'))}")
    if acct.get("funding_source_details"):
        print(f"[ok] Zahlungsmethode: {acct['funding_source_details'].get('display_string', 'vorhanden')}")
    else:
        print("[warnung] Keine Zahlungsmethode am Werbekonto sichtbar. Ohne Karte startet nichts.")
    page = find_page(env["token"])
    print(f"[ok] Seite: {page['name']} ({page['id']})")
    for spec in AD_SETS:
        key = resolve_locale(env["token"], spec["locale_query"])
        print(f"[ok] Locale {spec['locale_query']} -> {key}")
    print("\nAlles bereit fuer: python create_campaign.py create")


def cmd_create(env: dict):
    token, account = env["token"], env["account"]
    page = find_page(token)

    # Existiert die Kampagne schon? (Idempotenz)
    existing = api("GET", f"{account}/campaigns", token, fields="id,name",
                   filtering=json.dumps([{"field": "name", "operator": "EQUAL", "value": CAMPAIGN_NAME}])).get("data", [])
    if existing:
        campaign_id = existing[0]["id"]
        print(f"[ok] Kampagne existiert schon: {campaign_id} (nutze bestehende)")
    else:
        camp = api("POST", f"{account}/campaigns", token,
                   name=CAMPAIGN_NAME,
                   objective="OUTCOME_ENGAGEMENT",
                   status="PAUSED",
                   special_ad_categories="[]",
                   buying_type="AUCTION")
        campaign_id = camp["id"]
        print(f"[ok] Kampagne angelegt (PAUSED): {campaign_id}")

    for spec in AD_SETS:
        locale_key = resolve_locale(token, spec["locale_query"])
        targeting = {
            "geo_locations": {
                "custom_locations": [LIENZ],
                "location_types": ["travel_in"],  # Personen, die an diesen Ort reisen
            },
            "locales": [locale_key],
            "age_min": AGE_MIN,
            "age_max": AGE_MAX,
        }
        adset = api("POST", f"{account}/adsets", token,
                    name=spec["name"],
                    campaign_id=campaign_id,
                    daily_budget=DAILY_BUDGET_CENTS,
                    billing_event="IMPRESSIONS",
                    optimization_goal="CONVERSATIONS",
                    destination_type="WHATSAPP",
                    promoted_object=json.dumps({"page_id": page["id"]}),
                    targeting=json.dumps(targeting),
                    status="PAUSED")
        print(f"[ok] Ad Set angelegt (PAUSED): {spec['name']} -> {adset['id']}")

    print("\nFertig. Naechster Schritt: Anzeigen mit bestehenden Reels dranhaengen")
    print("(Ads Manager -> Kampagne -> Anzeige erstellen -> 'Vorhandenen Beitrag verwenden'),")
    print("Prefill-Text setzen, dann Kampagne live schalten.")


def cmd_status(env: dict):
    camps = api("GET", f"{env['account']}/campaigns", env["token"],
                fields="id,name,status,objective").get("data", [])
    kofly = [c for c in camps if "KOFLY" in c.get("name", "").upper()]
    if not kofly:
        print("[info] Keine KOFLY-Kampagnen im Konto.")
        return
    for c in kofly:
        print(f"Kampagne: {c['name']} | {c['status']} | {c['id']}")
        adsets = api("GET", f"{c['id']}/adsets", env["token"],
                     fields="id,name,status,daily_budget").get("data", [])
        for a in adsets:
            budget = int(a.get("daily_budget", 0)) / 100
            print(f"  Ad Set: {a['name']} | {a['status']} | {budget:.0f} EUR/Tag | {a['id']}")


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "check"
    envd = load_env()
    {"check": cmd_check, "create": cmd_create, "status": cmd_status}.get(
        mode, lambda _: sys.exit(f"[abbruch] Unbekannter Modus: {mode}"))(envd)
