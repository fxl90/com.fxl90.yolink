'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class SmokeAlarmDriver extends YoLinkDriver {
  _getTypeName() { return 'SmokeAlarm'; }
}

module.exports = SmokeAlarmDriver;
