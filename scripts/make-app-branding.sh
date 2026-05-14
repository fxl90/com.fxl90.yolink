#!/bin/bash
# Generates app-level branding: assets/icon.svg + app gallery PNGs.
# YoLink brand: lime green Y with signal waves, on white.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

GREEN="#8DC63F"     # YoLink signature lime green
DARK="#2D3033"      # Wordmark dark grey

# --- Logo fragment: stylized Y inside concentric signal waves (LoRa heritage).
#     Designed on a 500×500 viewBox.
LOGO_500='
  <g transform="translate(250 250)">
    <path d="M-100 -110 L0 30 L100 -110" fill="none" stroke="GREEN" stroke-width="42" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="0" y1="30" x2="0" y2="120" stroke="GREEN" stroke-width="42" stroke-linecap="round"/>
    <path d="M-160 -50 A 170 170 0 0 1 -130 -130" fill="none" stroke="GREEN" stroke-width="22" stroke-linecap="round"/>
    <path d="M160 -50 A 170 170 0 0 0 130 -130" fill="none" stroke="GREEN" stroke-width="22" stroke-linecap="round"/>
    <path d="M-200 -10 A 220 220 0 0 1 -160 -150" fill="none" stroke="GREEN" stroke-width="18" stroke-linecap="round" opacity="0.55"/>
    <path d="M200 -10 A 220 220 0 0 0 160 -150" fill="none" stroke="GREEN" stroke-width="18" stroke-linecap="round" opacity="0.55"/>
  </g>
'

# --- app icon (Homey renders as a mask: NO background)
cat > "$ROOT/assets/icon.svg" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
$(echo "$LOGO_500" | sed "s/GREEN/$GREEN/g")
</svg>
EOF
echo "✓ assets/icon.svg"

# --- App gallery PNGs (wide 1000×700 canvas, scaled down for small/large)
mkdir -p "$ROOT/assets/images"
TMP_SVG="$(mktemp)"
cat > "$TMP_SVG" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f3faea"/>
    </linearGradient>
  </defs>
  <rect width="1000" height="700" fill="url(#bg)"/>

  <!-- centered logo at 500×500, positioned upper-mid -->
  <g transform="translate(250 80)">
    $(echo "$LOGO_500" | sed "s/GREEN/$GREEN/g")
  </g>

  <!-- wordmark -->
  <text x="500" y="640" font-family="Helvetica, Arial, sans-serif"
        font-size="64" font-weight="700" fill="$DARK" text-anchor="middle">
    YoLink Local
  </text>
</svg>
EOF

rsvg-convert -w 250  -h 175  "$TMP_SVG" -o "$ROOT/assets/images/small.png"
rsvg-convert -w 500  -h 350  "$TMP_SVG" -o "$ROOT/assets/images/large.png"
rsvg-convert -w 1000 -h 700  "$TMP_SVG" -o "$ROOT/assets/images/xlarge.png"
rm -f "$TMP_SVG"
echo "✓ assets/images/{small,large,xlarge}.png"
