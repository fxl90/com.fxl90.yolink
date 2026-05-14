'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class PowerFailureAlarmDevice extends YoLinkDevice {

  async _applyState(data) {
    const state = data.state || {};
    if (state.powerSupply !== undefined || state.alertType !== undefined) {
      const failed = state.powerSupply === false || state.alertType === 'PowerOff';
      await this.setCapabilityValue('alarm_generic', failed).catch(err => this.error(err.message));
    }
    if (data.battery !== undefined) {
      await this.setCapabilityValue('measure_battery', this._batteryToPercent(data.battery)).catch(err => this.error(err.message));
    }
  }

  processMQTTMessage(payload) {
    this._applyState(payload.data || {});
  }

}

module.exports = PowerFailureAlarmDevice;
