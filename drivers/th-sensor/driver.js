'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class THSensorDriver extends YoLinkDriver {

  _getTypeName() {
    return 'THSensor';
  }

}

module.exports = THSensorDriver;
