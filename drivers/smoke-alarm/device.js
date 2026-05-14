'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class SmokeAlarmDevice extends YoLinkDevice {

  async _applyState(data) {
    const state = data.state || {};
    if (state.smokeAlarm !== undefined) {
      await this.setCapabilityValue('alarm_smoke', !!state.smokeAlarm).catch(err => this.error(err.message));
    }
    if (data.battery !== undefined) {
      await this.setCapabilityValue('measure_battery', this._batteryToPercent(data.battery)).catch(err => this.error(err.message));
    }
  }

  processMQTTMessage(payload) {
    this._applyState(payload.data || {});
  }

}

module.exports = SmokeAlarmDevice;
