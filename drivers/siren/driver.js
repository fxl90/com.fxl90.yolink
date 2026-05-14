'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class SirenDriver extends YoLinkDriver {
  _getTypeName() { return 'Siren'; }
}

module.exports = SirenDriver;
