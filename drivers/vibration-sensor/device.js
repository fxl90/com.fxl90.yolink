'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class VibrationSensorDevice extends YoLinkDevice {

  async _applyState(data) {
    const state = data.state || data;
    const vibrating = state.alertType === 'vibration' || state.state === 'alert' || state.vibration === true;
    if (state.alertType !== undefined || state.state !== undefined || state.vibration !== undefined) {
      await this.setCapabilityValue('alarm_motion', vibrating).catch(err => this.error(err.message));
    }
    if (data.battery !== undefined) {
      await this.setCapabilityValue('measure_battery', this._batteryToPercent(data.battery)).catch(err => this.error(err.message));
    }
  }

  processMQTTMessage(payload) {
    this._applyState(payload.data || {});
  }

}

module.exports = VibrationSensorDevice;
