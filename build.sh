#!/usr/bin/env bash
# Builds the single-page game from src/ into index.html (assets stay in a/)
set -e
cd "$(dirname "$0")"
{
echo '<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
echo '<title>Muay Thai Moe Demo</title>'
echo '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=Pixelify+Sans:wght@500;700&display=swap">'
echo '<style>'; cat src/style.css; echo '</style></head><body>'
echo '<div id="app"></div>'
echo '<script>'; cat src/engine.js src/chibi.js src/data.js src/story.js src/pixel.js src/audio.js src/ui.js src/quest.js | grep -v '^if(typeof module'; echo '</script>'
echo '</body></html>'
} > index.html
echo "built index.html"
