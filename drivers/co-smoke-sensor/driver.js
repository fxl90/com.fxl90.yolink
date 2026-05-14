'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class CoSmokeSensorDriver extends YoLinkDriver {
  _getTypeName() { return 'COSmokeSensor'; }
}

module.exports = CoSmokeSensorDriver;
