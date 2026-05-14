'use strict';

const Homey = require('homey');

class YoLinkDriver extends Homey.Driver {

  async onPairListDevices() {
    const api = this.homey.app.getAPI();
    if (!api) {
      throw new Error(this.homey.__('error.configure_hub'));
    }

    const devices = await api.getDeviceList();
    const typeName = this._getTypeName();

    return devices
      .filter(d => d.type === typeName)
      .map(d => ({
        name: d.name || `YoLink ${d.type}`,
        data: {
          deviceId: d.deviceId,
          token: d.token,
          type: d.type,
        },
      }));
  }

  _getTypeName() {
    throw new Error('Override _getTypeName() in driver subclass');
  }

}

module.exports = YoLinkDriver;
