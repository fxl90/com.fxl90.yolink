#!/bin/bash
# Generates Homey driver assets (icon.svg + small/large/xlarge PNGs) for every driver.
# Requires rsvg-convert (brew install librsvg). Compatible with macOS bash 3.2.
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
COLOR="#1a73e8"
BG="#ffffff"

make_icon() {
  local driver="$1"
  local fragment="$2"
  fragment="${fragment//COLOR/$COLOR}"
  local dir="$ROOT/drivers/$driver/assets"
  mkdir -p "$dir/images"

  # icon.svg: Homey renders this as a mask — no background, transparent.
  local icon_svg="<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 500 500\">$fragment</svg>"
  echo "$icon_svg" > "$dir/icon.svg"

  # PNGs: full device picture with white background for the gallery.
  local png_svg
  png_svg="$(mktemp)"
  echo "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 500 500\"><rect width=\"500\" height=\"500\" fill=\"$BG\"/>$fragment</svg>" > "$png_svg"
  rsvg-convert -w 75   -h 75   "$png_svg" -o "$dir/images/small.png"
  rsvg-convert -w 500  -h 500  "$png_svg" -o "$dir/images/large.png"
  rsvg-convert -w 1000 -h 1000 "$png_svg" -o "$dir/images/xlarge.png"
  rm -f "$png_svg"
  echo "✓ $driver"
}

make_icon switch '<rect x="160" y="120" width="180" height="260" rx="28" fill="none" stroke="COLOR" stroke-width="22"/><circle cx="250" cy="200" r="34" fill="COLOR"/><line x1="216" y1="290" x2="284" y2="290" stroke="COLOR" stroke-width="16" stroke-linecap="round"/>'

make_icon dimmer '<circle cx="250" cy="250" r="140" fill="none" stroke="COLOR" stroke-width="22"/><line x1="250" y1="250" x2="250" y2="140" stroke="COLOR" stroke-width="22" stroke-linecap="round"/><circle cx="250" cy="250" r="22" fill="COLOR"/>'

make_icon multi-outlet '<rect x="120" y="120" width="260" height="260" rx="30" fill="none" stroke="COLOR" stroke-width="22"/><circle cx="200" cy="200" r="14" fill="COLOR"/><circle cx="300" cy="200" r="14" fill="COLOR"/><circle cx="200" cy="300" r="14" fill="COLOR"/><circle cx="300" cy="300" r="14" fill="COLOR"/>'

make_icon sprinkler '<rect x="240" y="290" width="20" height="120" fill="COLOR"/><circle cx="250" cy="280" r="36" fill="COLOR"/><path d="M250 240 Q170 200 130 250" fill="none" stroke="COLOR" stroke-width="14" stroke-linecap="round"/><path d="M250 240 Q330 200 370 250" fill="none" stroke="COLOR" stroke-width="14" stroke-linecap="round"/><path d="M250 230 Q250 170 220 130" fill="none" stroke="COLOR" stroke-width="14" stroke-linecap="round"/><path d="M250 230 Q250 170 280 130" fill="none" stroke="COLOR" stroke-width="14" stroke-linecap="round"/>'

make_icon water-leak-controller '<circle cx="250" cy="250" r="80" fill="none" stroke="COLOR" stroke-width="22"/><line x1="170" y1="250" x2="100" y2="250" stroke="COLOR" stroke-width="22" stroke-linecap="round"/><line x1="330" y1="250" x2="400" y2="250" stroke="COLOR" stroke-width="22" stroke-linecap="round"/><line x1="250" y1="170" x2="250" y2="110" stroke="COLOR" stroke-width="22" stroke-linecap="round"/><rect x="220" y="80" width="60" height="40" fill="COLOR"/>'

make_icon door-sensor '<rect x="150" y="100" width="200" height="320" fill="none" stroke="COLOR" stroke-width="22"/><circle cx="310" cy="260" r="14" fill="COLOR"/><rect x="350" y="160" width="50" height="80" rx="6" fill="COLOR"/>'

make_icon motion-sensor '<circle cx="250" cy="320" r="50" fill="COLOR"/><path d="M180 240 Q250 180 320 240" fill="none" stroke="COLOR" stroke-width="18" stroke-linecap="round"/><path d="M150 200 Q250 110 350 200" fill="none" stroke="COLOR" stroke-width="18" stroke-linecap="round"/><path d="M120 160 Q250 50 380 160" fill="none" stroke="COLOR" stroke-width="18" stroke-linecap="round"/>'

make_icon th-sensor '<rect x="220" y="100" width="60" height="240" rx="30" fill="none" stroke="COLOR" stroke-width="20"/><circle cx="250" cy="370" r="50" fill="COLOR"/><rect x="240" y="160" width="20" height="180" fill="COLOR"/>'

make_icon leak-sensor '<path d="M250 80 C 160 220 160 320 250 400 C 340 320 340 220 250 80 Z" fill="none" stroke="COLOR" stroke-width="22" stroke-linejoin="round"/><circle cx="250" cy="290" r="30" fill="COLOR"/>'

make_icon garage-door '<rect x="100" y="140" width="300" height="260" fill="none" stroke="COLOR" stroke-width="22"/><line x1="100" y1="220" x2="400" y2="220" stroke="COLOR" stroke-width="18"/><line x1="100" y1="300" x2="400" y2="300" stroke="COLOR" stroke-width="18"/><polyline points="80,160 250,80 420,160" fill="none" stroke="COLOR" stroke-width="22" stroke-linejoin="round"/>'

make_icon lock '<rect x="140" y="240" width="220" height="180" rx="20" fill="none" stroke="COLOR" stroke-width="22"/><path d="M180 240 V180 a70 70 0 0 1 140 0 V240" fill="none" stroke="COLOR" stroke-width="22"/><circle cx="250" cy="320" r="20" fill="COLOR"/><rect x="240" y="320" width="20" height="60" fill="COLOR"/>'

make_icon thermostat '<circle cx="250" cy="250" r="160" fill="none" stroke="COLOR" stroke-width="22"/><circle cx="250" cy="250" r="100" fill="none" stroke="COLOR" stroke-width="14"/><text x="250" y="278" font-family="Arial" font-size="80" font-weight="bold" fill="COLOR" text-anchor="middle">°</text>'

make_icon smart-remote '<rect x="170" y="80" width="160" height="340" rx="30" fill="none" stroke="COLOR" stroke-width="22"/><circle cx="220" cy="170" r="22" fill="COLOR"/><circle cx="280" cy="170" r="22" fill="COLOR"/><circle cx="220" cy="250" r="22" fill="COLOR"/><circle cx="280" cy="250" r="22" fill="COLOR"/><circle cx="220" cy="330" r="22" fill="COLOR"/><circle cx="280" cy="330" r="22" fill="COLOR"/>'

make_icon outlet '<rect x="150" y="120" width="200" height="260" rx="30" fill="none" stroke="COLOR" stroke-width="22"/><circle cx="250" cy="220" r="18" fill="COLOR"/><rect x="220" y="290" width="20" height="50" fill="COLOR"/><rect x="260" y="290" width="20" height="50" fill="COLOR"/>'

make_icon smoke-alarm '<circle cx="250" cy="250" r="160" fill="none" stroke="COLOR" stroke-width="22"/><circle cx="250" cy="250" r="20" fill="COLOR"/><path d="M170 360 Q210 320 250 360 Q290 400 330 360" fill="none" stroke="COLOR" stroke-width="14" stroke-linecap="round"/><path d="M170 320 Q210 280 250 320 Q290 360 330 320" fill="none" stroke="COLOR" stroke-width="14" stroke-linecap="round"/>'

make_icon co-smoke-sensor '<circle cx="250" cy="250" r="160" fill="none" stroke="COLOR" stroke-width="22"/><text x="250" y="240" font-family="Arial" font-size="60" font-weight="bold" fill="COLOR" text-anchor="middle">CO</text><path d="M180 320 Q220 280 260 320 Q300 360 340 320" fill="none" stroke="COLOR" stroke-width="14" stroke-linecap="round"/>'

make_icon vibration-sensor '<rect x="200" y="180" width="100" height="140" rx="14" fill="none" stroke="COLOR" stroke-width="22"/><path d="M140 250 Q160 230 140 210" fill="none" stroke="COLOR" stroke-width="16" stroke-linecap="round"/><path d="M120 270 Q160 230 120 190" fill="none" stroke="COLOR" stroke-width="16" stroke-linecap="round"/><path d="M360 250 Q340 230 360 210" fill="none" stroke="COLOR" stroke-width="16" stroke-linecap="round"/><path d="M380 270 Q340 230 380 190" fill="none" stroke="COLOR" stroke-width="16" stroke-linecap="round"/>'

make_icon siren '<path d="M150 320 L250 120 L350 320 Z" fill="none" stroke="COLOR" stroke-width="22" stroke-linejoin="round"/><rect x="130" y="320" width="240" height="50" fill="COLOR"/><circle cx="250" cy="220" r="20" fill="COLOR"/>'

make_icon power-failure-alarm '<polygon points="240,80 160,260 230,260 200,420 320,210 250,210 280,80" fill="COLOR"/>'

make_icon double-dimmer '<rect x="100" y="120" width="140" height="260" rx="20" fill="none" stroke="COLOR" stroke-width="20"/><rect x="260" y="120" width="140" height="260" rx="20" fill="none" stroke="COLOR" stroke-width="20"/><circle cx="170" cy="200" r="22" fill="COLOR"/><circle cx="330" cy="200" r="22" fill="COLOR"/><line x1="140" y1="300" x2="200" y2="300" stroke="COLOR" stroke-width="14" stroke-linecap="round"/><line x1="300" y1="300" x2="360" y2="300" stroke="COLOR" stroke-width="14" stroke-linecap="round"/>'

make_icon finger '<rect x="180" y="120" width="140" height="260" rx="60" fill="none" stroke="COLOR" stroke-width="22"/><circle cx="250" cy="200" r="32" fill="COLOR"/><line x1="250" y1="260" x2="250" y2="340" stroke="COLOR" stroke-width="22" stroke-linecap="round"/>'

make_icon water-meter-controller '<circle cx="250" cy="250" r="160" fill="none" stroke="COLOR" stroke-width="22"/><line x1="250" y1="250" x2="320" y2="180" stroke="COLOR" stroke-width="22" stroke-linecap="round"/><circle cx="250" cy="250" r="18" fill="COLOR"/><path d="M250 380 C 230 400 230 410 250 420 C 270 410 270 400 250 380" fill="COLOR"/>'
