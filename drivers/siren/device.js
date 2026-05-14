'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class SirenDevice extends YoLinkDevice {

  async onInit() {
    const { deviceId, token } = this.getData();

    this.registerCapabilityListener('onoff', async (value) => {
      const api = this.homey.app.getAPI();
      if (!api) throw new Error('API not available');
      await api.request('Siren.setState', deviceId, token, {
        state: { alarm: value },
      });
    });

    await super.onInit();
  }

  async _applyState(data) {
    const state = data.state || {};
    if (state.alarm !== undefined || state.state !== undefined) {
      const on = state.alarm === true || state.state === 'alert';
      await this.setCapabilityValue('onoff', on).catch(err => this.error(err.message));
    }
    if (data.battery !== undefined) {
      await this.setCapabilityValue('measure_battery', this._batteryToPercent(data.battery)).catch(err => this.error(err.message));
    }
  }

  processMQTTMessage(payload) {
    this._applyState(payload.data || {});
  }

}

module.exports = SirenDevice;
