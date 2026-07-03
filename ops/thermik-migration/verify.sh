#!/usr/bin/env bash
# =====================================================================
# Verifikations-Script für thermik.net Path-Aware-Migration
# Nach Deploy der neuen .htaccess ausführen.
#
# Erwartetes Ergebnis: jede der 36 GSC-Umleitungsfehler-URLs liefert
# entweder 301 zu einer topisch-äquivalenten Seite ODER 410 Gone.
# Keine Path-Strip-301-zu-Homepage mehr.
# =====================================================================

set -u
GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'
PASS=0; FAIL=0

check() {
    local url="$1" expected="$2" desc="$3"
    local result
    result=$(curl -sIL -A "Googlebot" --max-time 10 "$url" 2>&1 | grep -E "^(HTTP|Location:)" | tr '\n' ' | ')
    local final_status
    final_status=$(curl -sIL -A "Googlebot" --max-time 10 -o /dev/null -w "%{http_code}" "$url" 2>&1)
    local first_status
    first_status=$(curl -sI -A "Googlebot" --max-time 10 -o /dev/null -w "%{http_code}" "$url" 2>&1)
    local first_location
    first_location=$(curl -sI -A "Googlebot" --max-time 10 "$url" 2>&1 | grep -i "^Location:" | head -1 | sed 's/^[Ll]ocation: //' | tr -d '\r\n ')

    if [[ "$expected" == "410" ]]; then
        if [[ "$first_status" == "410" ]]; then
            echo -e "${GREEN}✓${NC} [$first_status] $desc — $url"
            ((PASS++))
        else
            echo -e "${RED}✗${NC} [$first_status, expected 410] $desc — $url → $first_location"
            ((FAIL++))
        fi
    else
        if [[ "$first_status" == "301" && "$first_location" == "$expected" ]]; then
            echo -e "${GREEN}✓${NC} [301 → $expected] $desc — $url"
            ((PASS++))
        else
            echo -e "${RED}✗${NC} [$first_status → $first_location, expected 301 → $expected] $desc — $url"
            ((FAIL++))
        fi
    fi
}

echo "================================================================="
echo "thermik.net Path-Aware Migration — Verification"
echo "================================================================="

echo ""
echo "## 1) Root + Varianten (→ /de)"
check "https://thermik.net/"               "https://gleitschirm-tandemflug.com/de" "Root https"
check "http://thermik.net/"                "https://gleitschirm-tandemflug.com/de" "Root http"
check "https://www.thermik.net/"           "https://gleitschirm-tandemflug.com/de" "www https"
check "http://www.thermik.net/"            "https://gleitschirm-tandemflug.com/de" "www http"
check "https://thermik.net/index.php"      "https://gleitschirm-tandemflug.com/de" "index.php"

echo ""
echo "## 2) Topisch-äquivalente Maps"
check "https://thermik.net/kontakt/"       "https://gleitschirm-tandemflug.com/de/buchen"      "kontakt → buchen"
check "https://thermik.net/links/"         "https://gleitschirm-tandemflug.com/de"             "links → /de"
check "https://thermik.net/archives/14161-tandem-lienz-vom-zettersfeld.html"          "https://gleitschirm-tandemflug.com/de/urlaub"     "tandem-lienz-Artikel"
check "https://thermik.net/archives/8300-faszination-gleitschirm-tandemfliegen.html"  "https://gleitschirm-tandemflug.com/de/paragleiten" "faszination-tandem-Artikel"

echo ""
echo "## 3) 410 Gone für alte Blog-Archive (Speedflying/Gear/Events)"
check "https://thermik.net/archives/2201-spitfire-2-test.html"                              "410" "Spitfire-2-Test"
check "https://thermik.net/archives/1987-red-bull-x-alps-news.html"                         "410" "Red Bull X-Alps News"
check "https://thermik.net/archives/205-NEW!-Swing-Flash-15qm-18qm.html"                    "410" "Swing-Flash-News"
check "https://thermik.net/archives/1179-die-steilspirale-problematik-und-tutorial-2.html"  "410" "Steilspirale-Tutorial"
check "https://thermik.net/archives/14156-club-touch-heaven-party-die-letschte-kuah-mocht-die-gotta-zua.html" "410" "Club-Touch-Party"
check "https://thermik.net/archives/1813-flugwetter-wetterkunde-und-meteorlogische-vorbereitung.html" "410" "Flugwetter-Tutorial"
check "https://thermik.net/archives/1146-paragliding-in-indien-kamshet-mit-temple-pilots-2.html" "410" "Kamshet-Indien"

echo ""
echo "## 4) 410 für Tags, Permalinks, Feeds, Pagination"
check "https://thermik.net/permalink/ZLLV-2010-in-Austria-Deregulation.html" "410" "Permalink"
check "https://thermik.net/archives/tag/subair-delight/"                     "410" "Tag-Archive"
check "https://thermik.net/archives/tag/molltaler-gletscher/"                "410" "Tag-Archive 2"
check "https://thermik.net/page/64/"                                         "410" "Pagination"
check "https://thermik.net/feed/"                                            "410" "RSS-Feed"

echo ""
echo "## 5) dev.thermik.net (entire subdomain → 410)"
check "https://dev.thermik.net/"           "410" "dev-Subdomain Root"
check "https://dev.thermik.net/anything"   "410" "dev-Subdomain Path"

echo ""
echo "================================================================="
echo -e "Result: ${GREEN}${PASS} passed${NC}, ${RED}${FAIL} failed${NC}"
echo "================================================================="

[[ $FAIL -eq 0 ]] && exit 0 || exit 1
