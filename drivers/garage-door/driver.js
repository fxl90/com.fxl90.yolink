'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class GarageDoorDriver extends YoLinkDriver {

  _getTypeName() {
    return 'GarageDoor';
  }

}

module.exports = GarageDoorDriver;
