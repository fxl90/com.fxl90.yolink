'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class DoubleDimmerDriver extends YoLinkDriver {
  _getTypeName() { return 'DoubleDimmer'; }
}

module.exports = DoubleDimmerDriver;
