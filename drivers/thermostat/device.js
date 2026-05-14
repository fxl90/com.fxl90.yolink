'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class ThermostatDevice extends YoLinkDevice {

  async onInit() {
    const { deviceId, token } = this.getData();

    this.registerCapabilityListener('thermostat_mode', async (value) => {
      const api = this.homey.app.getAPI();
      if (!api) throw new Error('API not available');
      await api.request('Thermostat.setState', deviceId, token, {
        mode: value,
      });
    });

    this.registerCapabilityListener('target_temperature', async (value) => {
      const api = this.homey.app.getAPI();
      if (!api) throw new Error('API not available');
      await api.request('Thermostat.setState', deviceId, token, {
        lowTemp: value,
        highTemp: value + 2,
      });
    });

    await super.onInit();
  }

  async _applyState(data) {
    const state = data.state ?? data;
    if (state.temperature !== undefined) {
      await this.setCapabilityValue('measure_temperature', state.temperature).catch(err => this.error('measure_temperature set error:', err.message));
    }
    if (state.mode !== undefined) {
      await this.setCapabilityValue('thermostat_mode', state.mode).catch(err => this.error('thermostat_mode set error:', err.message));
    }
    if (state.lowTemp !== undefined) {
      await this.setCapabilityValue('target_temperature', state.lowTemp).catch(err => this.error('target_temperature set error:', err.message));
    }
  }

  processMQTTMessage(payload) {
    const data = payload.data;
    if (!data) return;

    if (data.temperature !== undefined) {
      this.setCapabilityValue('measure_temperature', data.temperature).catch(err => this.error('MQTT measure_temperature error:', err.message));
    }
    if (data.mode !== undefined) {
      this.setCapabilityValue('thermostat_mode', data.mode).catch(err => this.error('MQTT thermostat_mode error:', err.message));
    }
  }

}

module.exports = ThermostatDevice;
