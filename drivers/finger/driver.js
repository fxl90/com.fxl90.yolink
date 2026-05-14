'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class FingerDriver extends YoLinkDriver {
  _getTypeName() { return 'Finger'; }
}

module.exports = FingerDriver;
