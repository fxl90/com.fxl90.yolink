'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class ThermostatDriver extends YoLinkDriver {

  _getTypeName() {
    return 'Thermostat';
  }

}

module.exports = ThermostatDriver;
