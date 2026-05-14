'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class SwitchDevice extends YoLinkDevice {

  async onInit() {
    const { deviceId, token } = this.getData();

    this.registerCapabilityListener('onoff', async (value) => {
      const api = this.homey.app.getAPI();
      if (!api) throw new Error('API not available');
      await api.request('Switch.setState', deviceId, token, {
        state: value ? 'open' : 'closed',
      });
    });

    await super.onInit();
  }

  async _applyState(data) {
    await this.setCapabilityValue('onoff', data.state === 'open').catch(err => this.error('onoff set error:', err.message));
  }

  processMQTTMessage(payload) {
    const state = payload.data?.state;
    if (state !== undefined) {
      this.setCapabilityValue('onoff', state === 'open').catch(err => this.error('MQTT onoff error:', err.message));
    }
  }

}

module.exports = SwitchDevice;
