'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class MotionSensorDriver extends YoLinkDriver {

  _getTypeName() {
    return 'MotionSensor';
  }

}

module.exports = MotionSensorDriver;
