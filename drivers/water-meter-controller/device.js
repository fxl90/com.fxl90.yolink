'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class WaterMeterControllerDevice extends YoLinkDevice {

  async _applyState(data) {
    const state = data.state || {};
    const meter = state.meter ?? state.totalWater ?? data.meterReading;
    if (meter !== undefined) {
      // YoLink reports volume in litres (or 0.1 m3 depending on firmware); pass through as-is to meter_water (m³).
      const m3 = typeof meter === 'number' ? meter / 1000 : Number(meter) / 1000;
      if (!Number.isNaN(m3)) {
        await this.setCapabilityValue('meter_water', m3).catch(err => this.error(err.message));
      }
    }
    if (data.battery !== undefined) {
      await this.setCapabilityValue('measure_battery', this._batteryToPercent(data.battery)).catch(err => this.error(err.message));
    }
  }

  processMQTTMessage(payload) {
    this._applyState(payload.data || {});
  }

}

module.exports = WaterMeterControllerDevice;
