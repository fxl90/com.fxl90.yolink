'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class THSensorDevice extends YoLinkDevice {

  async onInit() {
    await super.onInit();
  }

  async _applyState(data) {
    if (data.online === false) {
      await this.setUnavailable(this.homey.__('error.unreachable')).catch(() => {});
      return;
    }

    const state = data.state ?? data;
    if (state.temperature !== undefined) {
      await this.setCapabilityValue('measure_temperature', state.temperature).catch(err => this.error('measure_temperature set error:', err.message));
    }
    if (state.humidity !== undefined) {
      await this.setCapabilityValue('measure_humidity', state.humidity).catch(err => this.error('measure_humidity set error:', err.message));
    }
    if (state.battery !== undefined) {
      await this.setCapabilityValue('measure_battery', this._batteryToPercent(state.battery)).catch(err => this.error('measure_battery set error:', err.message));
    }
  }

  processMQTTMessage(payload) {
    const data = payload.data;
    if (!data) return;

    if (data.temperature !== undefined) {
      this.setCapabilityValue('measure_temperature', data.temperature).catch(err => this.error('MQTT measure_temperature error:', err.message));
    }
    if (data.humidity !== undefined) {
      this.setCapabilityValue('measure_humidity', data.humidity).catch(err => this.error('MQTT measure_humidity error:', err.message));
    }
    if (data.battery !== undefined) {
      this.setCapabilityValue('measure_battery', this._batteryToPercent(data.battery)).catch(err => this.error('MQTT measure_battery error:', err.message));
    }
  }

}

module.exports = THSensorDevice;
