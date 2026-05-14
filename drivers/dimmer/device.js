'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class DimmerDevice extends YoLinkDevice {

  async onInit() {
    const { deviceId, token } = this.getData();

    this.registerCapabilityListener('onoff', async (value) => {
      const api = this.homey.app.getAPI();
      if (!api) throw new Error('API not available');
      await api.request('Dimmer.setState', deviceId, token, {
        state: value ? 'open' : 'closed',
      });
    });

    this.registerCapabilityListener('dim', async (value) => {
      const api = this.homey.app.getAPI();
      if (!api) throw new Error('API not available');
      await api.request('Dimmer.setState', deviceId, token, {
        state: 'open',
        brightness: Math.max(1, Math.round(value * 100)),
      });
    });

    await super.onInit();
  }

  async _applyState(data) {
    await this.setCapabilityValue('onoff', data.state === 'open').catch(err => this.error('onoff set error:', err.message));
    if (data.brightness !== undefined) {
      await this.setCapabilityValue('dim', data.brightness / 100).catch(err => this.error('dim set error:', err.message));
    }
  }

  processMQTTMessage(payload) {
    const data = payload.data;
    if (!data) return;

    if (data.state !== undefined) {
      this.setCapabilityValue('onoff', data.state === 'open').catch(err => this.error('MQTT onoff error:', err.message));
    }
    if (data.brightness !== undefined) {
      this.setCapabilityValue('dim', data.brightness / 100).catch(err => this.error('MQTT dim error:', err.message));
    }
  }

}

module.exports = DimmerDevice;
