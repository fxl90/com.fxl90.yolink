'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class LockDevice extends YoLinkDevice {

  async onInit() {
    const { deviceId, token } = this.getData();

    this.registerCapabilityListener('locked', async (value) => {
      const api = this.homey.app.getAPI();
      if (!api) throw new Error('API not available');
      await api.request('Lock.setState', deviceId, token, {
        state: value ? 'locked' : 'unlocked',
      });
    });

    await super.onInit();
  }

  async _applyState(data) {
    const state = data.state ?? data;
    await this.setCapabilityValue('locked', state.state === 'locked').catch(err => this.error('locked set error:', err.message));
    if (state.battery !== undefined) {
      await this.setCapabilityValue('measure_battery', this._batteryToPercent(state.battery)).catch(err => this.error('measure_battery set error:', err.message));
    }
  }

  processMQTTMessage(payload) {
    const data = payload.data;
    if (!data) return;

    if (data.state !== undefined) {
      this.setCapabilityValue('locked', data.state === 'locked').catch(err => this.error('MQTT locked error:', err.message));
    }
    if (data.battery !== undefined) {
      this.setCapabilityValue('measure_battery', this._batteryToPercent(data.battery)).catch(err => this.error('MQTT measure_battery error:', err.message));
    }
  }

}

module.exports = LockDevice;
