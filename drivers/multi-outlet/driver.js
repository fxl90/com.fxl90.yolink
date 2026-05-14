'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class MultiOutletDriver extends YoLinkDriver {

  _getTypeName() {
    return 'MultiOutlet';
  }

}

module.exports = MultiOutletDriver;
