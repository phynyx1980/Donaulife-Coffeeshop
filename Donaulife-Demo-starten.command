#!/bin/bash
# Donaulife Coffeeshop — Lokale Demo starten
# Doppelklick auf diese Datei startet den Server und öffnet die Seite im Browser.

cd "$(dirname "$0")"

# Falls noch kein Production-Build existiert, einmal bauen
if [ ! -d ".next" ]; then
  echo "Erstelle Production-Build (einmalig, dauert kurz)..."
  npm run build
fi

# Browser nach kurzer Verzögerung öffnen, sobald der Server läuft
( sleep 2 && open "http://localhost:3000" ) &

echo ""
echo "=================================================="
echo "  Donaulife Coffeeshop läuft auf localhost:3000"
echo "  Zum Beenden: dieses Fenster schließen oder"
echo "  Strg + C drücken."
echo "=================================================="
echo ""

npm run start
