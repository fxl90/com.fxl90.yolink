'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class MotionSensorDevice extends YoLinkDevice {

  async onInit() {
    await super.onInit();
  }

  async _applyState(data) {
    if (data.online === false) {
      await this.setUnavailable(this.homey.__('error.unreachable')).catch(() => {});
      return;
    }

    const state = data.state ?? data;
    await this.setCapabilityValue('alarm_motion', state.state === 'alert').catch(err => this.error('alarm_motion set error:', err.message));
    if (state.battery !== undefined) {
      await this.setCapabilityValue('measure_battery', this._batteryToPercent(state.battery)).catch(err => this.error('measure_battery set error:', err.message));
    }
  }

  processMQTTMessage(payload) {
    const data = payload.data;
    if (!data) return;

    if (data.state !== undefined) {
      this.setCapabilityValue('alarm_motion', data.state === 'alert').catch(err => this.error('MQTT alarm_motion error:', err.message));
    }
    if (data.battery !== undefined) {
      this.setCapabilityValue('measure_battery', this._batteryToPercent(data.battery)).catch(err => this.error('MQTT measure_battery error:', err.message));
    }
  }

}

module.exports = MotionSensorDevice;
