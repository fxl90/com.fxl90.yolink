'use strict';

const Homey = require('homey');

class YoLinkDevice extends Homey.Device {

  static POLL_INTERVAL_MS = 60000;

  async onInit() {
    const { deviceId } = this.getData();
    this.homey.app.registerDevice(deviceId, this);

    try {
      await this._syncState();
      await this.setAvailable();
    } catch (err) {
      this.error('Initial sync failed:', err.message);
      await this.setUnavailable(this.homey.__('error.unreachable'));
    }

    this._startPolling();
  }

  async onDeleted() {
    this._stopPolling();
    const { deviceId } = this.getData();
    this.homey.app.unregisterDevice(deviceId);
  }

  async _syncState() {
    const api = this.homey.app.getAPI();
    if (!api) throw new Error('API not available');

    const { deviceId, token, type } = this.getData();
    const data = await api.request(`${type}.getState`, deviceId, token);
    await this._applyState(data);
    await this.setAvailable();
  }

  async _applyState(data) {
    // Override in subclass
  }

  processMQTTMessage(payload) {
    // Override in subclass
  }

  _startPolling() {
    this._stopPolling();
    this._pollInterval = setInterval(async () => {
      try {
        await this._syncState();
      } catch (err) {
        this.error('Poll sync failed:', err.message);
        await this.setUnavailable(this.homey.__('error.unreachable')).catch(() => {});
      }
    }, YoLinkDevice.POLL_INTERVAL_MS);
  }

  _stopPolling() {
    if (this._pollInterval) {
      clearInterval(this._pollInterval);
      this._pollInterval = null;
    }
  }

  _batteryToPercent(battery) {
    return Math.round(Math.min(4, Math.max(0, battery)) * 25);
  }

}

module.exports = YoLinkDevice;
