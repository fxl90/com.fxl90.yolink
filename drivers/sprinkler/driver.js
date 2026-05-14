'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class SprinklerDriver extends YoLinkDriver {

  _getTypeName() {
    return 'Sprinkler';
  }

}

module.exports = SprinklerDriver;
