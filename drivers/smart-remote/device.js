'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class SmartRemoteDevice extends YoLinkDevice {

  async onInit() {
    await super.onInit();
  }

  async _syncState() {
    // SmartRemoter has no getState — register device and mark available
    const { deviceId } = this.getData();
    this.homey.app.registerDevice(deviceId, this);
    await this.setAvailable();
  }

  processMQTTMessage(payload) {
    const button = payload.data?.key;
    const action = payload.data?.event;

    if (button !== undefined && action !== undefined) {
      this.driver.triggerButtonPressed
        .trigger(this, { button, action })
        .catch(err => this.error('MQTT trigger error:', err.message));
    }
  }

}

module.exports = SmartRemoteDevice;
