'use strict';

const Homey = require('homey');
const YoLinkAPI = require('./YoLinkAPI');

class YoLinkDriver extends Homey.Driver {

  async onPair(session) {
    // Skip the credentials view entirely when we already have a working API connection
    session.setHandler('showView', async (viewId) => {
      if (viewId === 'credentials' && this.homey.app.getAPI()) {
        await session.showView('list_devices');
      }
    });

    // Return current saved settings so the credentials page can pre-fill
    session.setHandler('get_settings', async () => {
      return {
        hub_ip:        this.homey.settings.get('hub_ip')        || '',
        client_id:     this.homey.settings.get('client_id')     || '',
        client_secret: this.homey.settings.get('client_secret') || '',
        subnet_id:     this.homey.settings.get('subnet_id')     || '',
      };
    });

    // Validate credentials, save them, and reconnect the app
    session.setHandler('save_credentials', async (data) => {
      const { hub_ip, client_id, client_secret, subnet_id } = data;

      // Test the connection before saving
      const api = new YoLinkAPI(hub_ip, client_id, client_secret);
      await api.authenticate(); // throws with a meaningful message on failure

      // Persist to app settings
      this.homey.settings.set('hub_ip',        hub_ip);
      this.homey.settings.set('client_id',     client_id);
      this.homey.settings.set('client_secret', client_secret);
      this.homey.settings.set('subnet_id',     subnet_id);

      // Reconnect the shared API + MQTT client in the app
      await this.homey.app._connect();
    });

    // Called by the list_devices template
    session.setHandler('list_devices', async () => {
      return this.onPairListDevices();
    });
  }

  async onPairListDevices() {
    const api = this.homey.app.getAPI();
    if (!api) {
      throw new Error('Hub not connected. Please go back and enter your hub credentials.');
    }

    const devices = await api.getDeviceList();
    const typeName = this._getTypeName();

    // Log all device types returned — visible in Homey developer tools
    this.log('Device list from hub:', JSON.stringify(devices.map(d => ({ type: d.type, name: d.name, deviceId: d.deviceId }))));
    this.log(`Filtering for type: ${typeName}`);

    return devices
      .filter(d => d.type === typeName)
      .map(d => ({
        // Guard against the hub returning "null" as a literal string for unnamed devices
        name: (d.name && d.name !== 'null') ? d.name : `YoLink ${d.type} (${d.deviceId?.slice(-6) ?? '?'})`,
        data: {
          deviceId: d.deviceId,
          token:    d.token,
          type:     d.type,
        },
      }));
  }

  _getTypeName() {
    throw new Error('Override _getTypeName() in driver subclass');
  }

}

module.exports = YoLinkDriver;
