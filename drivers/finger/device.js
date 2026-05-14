'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class FingerDevice extends YoLinkDevice {

  async onInit() {
    const { deviceId, token } = this.getData();

    this.registerCapabilityListener('button', async () => {
      const api = this.homey.app.getAPI();
      if (!api) throw new Error('API not available');
      await api.request('Finger.setState', deviceId, token, { state: 'press' });
    });

    await super.onInit();
  }

  async _applyState(data) {
    if (data.battery !== undefined) {
      if (!this.hasCapability('measure_battery')) await this.addCapability('measure_battery');
      await this.setCapabilityValue('measure_battery', this._batteryToPercent(data.battery)).catch(err => this.error(err.message));
    }
  }

  processMQTTMessage(payload) {
    this._applyState(payload.data || {});
  }

}

module.exports = FingerDevice;
