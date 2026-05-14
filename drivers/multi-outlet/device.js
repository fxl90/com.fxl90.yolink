'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class MultiOutletDevice extends YoLinkDevice {

  async onInit() {
    const { deviceId, token } = this.getData();

    this.registerCapabilityListener('onoff', async (value) => {
      const api = this.homey.app.getAPI();
      if (!api) throw new Error('API not available');
      await api.request('MultiOutlet.setState', deviceId, token, {
        chs: '0xFF',
        state: value ? 'open' : 'closed',
      });
    });

    await super.onInit();
  }

  async _applyState(data) {
    if (Array.isArray(data.state)) {
      const anyOpen = data.state.some(s => s === 'open');
      await this.setCapabilityValue('onoff', anyOpen).catch(err => this.error('onoff set error:', err.message));
    }
  }

  processMQTTMessage(payload) {
    const state = payload.data?.state;
    if (Array.isArray(state)) {
      const anyOpen = state.some(s => s === 'open');
      this.setCapabilityValue('onoff', anyOpen).catch(err => this.error('MQTT onoff error:', err.message));
    }
  }

}

module.exports = MultiOutletDevice;
