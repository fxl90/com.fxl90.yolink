'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class GarageDoorDevice extends YoLinkDevice {

  async onInit() {
    const { deviceId, token } = this.getData();

    this.registerCapabilityListener('garagedoor_closed', async (value) => {
      const api = this.homey.app.getAPI();
      if (!api) throw new Error('API not available');
      await api.request('GarageDoor.toggle', deviceId, token);
    });

    await super.onInit();
  }

  async _applyState(data) {
    await this.setCapabilityValue('garagedoor_closed', data.state === 'closed').catch(err => this.error('garagedoor_closed set error:', err.message));
    if (data.battery !== undefined) {
      // GarageDoor has battery but no measure_battery capability — silently skip
    }
  }

  processMQTTMessage(payload) {
    const state = payload.data?.state;
    if (state !== undefined) {
      this.setCapabilityValue('garagedoor_closed', state === 'closed').catch(err => this.error('MQTT garagedoor_closed error:', err.message));
    }
  }

}

module.exports = GarageDoorDevice;
