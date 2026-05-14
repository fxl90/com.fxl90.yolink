'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class VibrationSensorDriver extends YoLinkDriver {
  _getTypeName() { return 'VibrationSensor'; }
}

module.exports = VibrationSensorDriver;
