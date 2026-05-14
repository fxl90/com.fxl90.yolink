'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class DoorSensorDevice extends YoLinkDevice {

  async onInit() {
    await super.onInit();
  }

  async _applyState(data) {
    if (data.online === false) {
      await this.setUnavailable(this.homey.__('error.unreachable')).catch(() => {});
      return;
    }

    const state = data.state ?? data;
    await this.setCapabilityValue('alarm_contact', state.state === 'open').catch(err => this.error('alarm_contact set error:', err.message));
    if (state.battery !== undefined) {
      await this.setCapabilityValue('measure_battery', this._batteryToPercent(state.battery)).catch(err => this.error('measure_battery set error:', err.message));
    }
  }

  processMQTTMessage(payload) {
    const data = payload.data;
    if (!data) return;

    if (data.state !== undefined) {
      this.setCapabilityValue('alarm_contact', data.state === 'open').catch(err => this.error('MQTT alarm_contact error:', err.message));
    }
    if (data.battery !== undefined) {
      this.setCapabilityValue('measure_battery', this._batteryToPercent(data.battery)).catch(err => this.error('MQTT measure_battery error:', err.message));
    }
  }

}

module.exports = DoorSensorDevice;
