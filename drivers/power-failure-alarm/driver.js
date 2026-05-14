'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class PowerFailureAlarmDriver extends YoLinkDriver {
  _getTypeName() { return 'PowerFailureAlarm'; }
}

module.exports = PowerFailureAlarmDriver;
