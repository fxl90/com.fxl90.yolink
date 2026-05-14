'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class LeakSensorDriver extends YoLinkDriver {

  _getTypeName() {
    return 'LeakSensor';
  }

}

module.exports = LeakSensorDriver;
