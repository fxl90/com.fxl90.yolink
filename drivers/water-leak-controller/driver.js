'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class WaterLeakControllerDriver extends YoLinkDriver {

  _getTypeName() {
    return 'WaterLeakController';
  }

}

module.exports = WaterLeakControllerDriver;
