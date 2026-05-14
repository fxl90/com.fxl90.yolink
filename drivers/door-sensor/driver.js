'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class DoorSensorDriver extends YoLinkDriver {

  _getTypeName() {
    return 'DoorSensor';
  }

}

module.exports = DoorSensorDriver;
