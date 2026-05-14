'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class LockDriver extends YoLinkDriver {

  _getTypeName() {
    return 'Lock';
  }

}

module.exports = LockDriver;
