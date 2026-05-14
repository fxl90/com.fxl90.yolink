'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class DimmerDriver extends YoLinkDriver {

  _getTypeName() {
    return 'Dimmer';
  }

}

module.exports = DimmerDriver;
