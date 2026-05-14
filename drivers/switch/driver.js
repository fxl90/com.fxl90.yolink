'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class SwitchDriver extends YoLinkDriver {

  _getTypeName() {
    return 'Switch';
  }

}

module.exports = SwitchDriver;
