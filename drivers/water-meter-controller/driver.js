'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class WaterMeterControllerDriver extends YoLinkDriver {
  _getTypeName() { return 'WaterMeterController'; }
}

module.exports = WaterMeterControllerDriver;
