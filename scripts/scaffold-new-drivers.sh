#!/bin/bash
# One-shot scaffolder for 9 additional YoLink driver types.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CREDS_SRC="$ROOT/drivers/switch/pair/credentials.html"

make_driver() {
  local id="$1" type="$2" name="$3" class="$4" caps_json="$5"
  local dir="$ROOT/drivers/$id"
  mkdir -p "$dir/pair"

  cat > "$dir/driver.compose.json" <<EOF
{
  "name": { "en": "$name" },
  "class": "$class",
  "capabilities": $caps_json,
  "platforms": ["local"],
  "connectivity": ["lan"],
  "pair": [
    { "id": "credentials" },
    { "id": "list_devices", "template": "list_devices", "navigation": { "next": "add_devices" } },
    { "id": "add_devices", "template": "add_devices" }
  ]
}
EOF

  local cls
  cls="$(echo "$id" | awk -F'-' '{ for(i=1;i<=NF;i++) printf "%s", toupper(substr($i,1,1)) substr($i,2); print "" }')"

  cat > "$dir/driver.js" <<EOF
'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class ${cls}Driver extends YoLinkDriver {
  _getTypeName() { return '$type'; }
}

module.exports = ${cls}Driver;
EOF

  cp "$CREDS_SRC" "$dir/pair/credentials.html"
  echo "✓ scaffolded $id"
}

# id              YoLinkType            display name                   class       capabilities
make_driver outlet              Outlet              "YoLink Outlet"               socket    '["onoff"]'
make_driver smoke-alarm         SmokeAlarm          "YoLink Smoke Alarm"          sensor    '["alarm_smoke","measure_battery"]'
make_driver co-smoke-sensor     COSmokeSensor       "YoLink CO & Smoke Sensor"    sensor    '["alarm_smoke","alarm_co","measure_battery"]'
make_driver vibration-sensor    VibrationSensor     "YoLink Vibration Sensor"     sensor    '["alarm_motion","measure_battery"]'
make_driver siren               Siren               "YoLink Siren"                other     '["onoff","measure_battery"]'
make_driver power-failure-alarm PowerFailureAlarm   "YoLink Power Failure Alarm"  sensor    '["alarm_generic","measure_battery"]'
make_driver double-dimmer       DoubleDimmer        "YoLink Double Dimmer"        light     '["onoff","dim","onoff.ch2","dim.ch2"]'
make_driver finger              Finger              "YoLink Finger"               button    '["button"]'
make_driver water-meter-controller WaterMeterController "YoLink Water Meter"      sensor    '["meter_water","measure_battery"]'
