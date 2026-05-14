'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class OutletDevice extends YoLinkDevice {

  async onInit() {
    const { deviceId, token } = this.getData();

    this.registerCapabilityListener('onoff', async (value) => {
      const api = this.homey.app.getAPI();
      if (!api) throw new Error('API not available');
      await api.request('Outlet.setState', deviceId, token, {
        chs: 1,
        state: value ? 'open' : 'closed',
      });
    });

    await super.onInit();
  }

  async _applyState(data) {
    if (data.state !== undefined) {
      await this.setCapabilityValue('onoff', data.state === 'open').catch(err => this.error(err.message));
    }
  }

  processMQTTMessage(payload) {
    const state = payload.data?.state;
    if (state !== undefined) {
      this.setCapabilityValue('onoff', state === 'open').catch(err => this.error(err.message));
    }
  }

}

module.exports = OutletDevice;
