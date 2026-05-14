'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class SprinklerDevice extends YoLinkDevice {

  async onInit() {
    const { deviceId, token } = this.getData();

    this.registerCapabilityListener('onoff', async (value) => {
      const api = this.homey.app.getAPI();
      if (!api) throw new Error('API not available');
      await api.request('Sprinkler.setState', deviceId, token, {
        state: { mode: value ? 'manual' : 'auto' },
      });
    });

    await super.onInit();
  }

  async _applyState(data) {
    const state = data.state ?? data;
    await this.setCapabilityValue('onoff', state.mode === 'manual').catch(err => this.error('onoff set error:', err.message));
  }

  processMQTTMessage(payload) {
    const mode = payload.data?.state?.mode;
    if (mode !== undefined) {
      this.setCapabilityValue('onoff', mode === 'manual').catch(err => this.error('MQTT onoff error:', err.message));
    }
  }

}

module.exports = SprinklerDevice;
