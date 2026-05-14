'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class OutletDriver extends YoLinkDriver {
  _getTypeName() { return 'Outlet'; }
}

module.exports = OutletDriver;
