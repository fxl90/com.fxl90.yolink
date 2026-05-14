'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class SmartRemoteDevice extends YoLinkDevice {

  async _syncState() {
    // SmartRemoter has no getState — register and mark available.
    const { deviceId } = this.getData();
    this.homey.app.registerDevice(deviceId, this);
    await this.setAvailable();
  }

  processMQTTMessage(payload) {
    this.log('SmartRemoter MQTT payload:', JSON.stringify(payload));

    const data = payload?.data || {};
    let button;
    let action;

    // Firmware variant A: { key: 1, event: 'Press' }
    if (data.key !== undefined && data.event !== undefined && typeof data.event === 'string') {
      button = Number(data.key);
      action = data.event;
    }
    // Firmware variant B: { event: { keyMask: 1, type: 'Press' } }
    else if (data.event && typeof data.event === 'object') {
      const km = data.event.keyMask ?? data.event.key;
      if (km !== undefined) {
        // keyMask is a bitmask — log2 + 1 gives the 1-indexed button
        button = (km > 0) ? Math.round(Math.log2(km)) + 1 : Number(km);
      }
      action = data.event.type || data.event.event;
    }
    // Firmware variant C: { keyMask: 1, type: 'Press' }
    else if (data.keyMask !== undefined && data.type !== undefined) {
      button = (data.keyMask > 0) ? Math.round(Math.log2(data.keyMask)) + 1 : Number(data.keyMask);
      action = data.type;
    }

    if (button !== undefined && action !== undefined) {
      this.driver.triggerButtonPressed
        .trigger(this, { button, action }, { button, action })
        .then(() => this.log(`Triggered button ${button} (${action})`))
        .catch(err => this.error('Trigger error:', err.message));
    } else {
      this.log('Could not parse button press from payload — please open an issue with the JSON above.');
    }
  }

}

module.exports = SmartRemoteDevice;
