'use strict';

const YoLinkDevice = require('../../lib/YoLinkDevice');

class DoubleDimmerDevice extends YoLinkDevice {

  async onInit() {
    const { deviceId, token } = this.getData();

    const setChannel = async (chs, params) => {
      const api = this.homey.app.getAPI();
      if (!api) throw new Error('API not available');
      await api.request('DoubleDimmer.setState', deviceId, token, { chs, ...params });
    };

    this.registerCapabilityListener('onoff', (v) => setChannel(1, { state: v ? 'open' : 'closed' }));
    this.registerCapabilityListener('dim',   (v) => setChannel(1, { brightness: Math.round(v * 100) }));
    this.registerCapabilityListener('onoff.ch2', (v) => setChannel(2, { state: v ? 'open' : 'closed' }));
    this.registerCapabilityListener('dim.ch2',   (v) => setChannel(2, { brightness: Math.round(v * 100) }));

    await super.onInit();
  }

  async _applyState(data) {
    const state = data.state || {};
    const channels = Array.isArray(state) ? state : (state.delay || state.channels || []);
    // YoLink returns per-channel arrays; fall back to top-level fields if not present
    const ch1 = channels[0] || state.ch1 || state;
    const ch2 = channels[1] || state.ch2 || {};

    const apply = async (cap, value) => {
      if (this.hasCapability(cap) && value !== undefined) {
        await this.setCapabilityValue(cap, value).catch(err => this.error(`${cap}:`, err.message));
      }
    };

    if (ch1?.state !== undefined)      await apply('onoff',     ch1.state === 'open');
    if (ch1?.brightness !== undefined) await apply('dim',       ch1.brightness / 100);
    if (ch2?.state !== undefined)      await apply('onoff.ch2', ch2.state === 'open');
    if (ch2?.brightness !== undefined) await apply('dim.ch2',   ch2.brightness / 100);
  }

  processMQTTMessage(payload) {
    this._applyState(payload.data || {});
  }

}

module.exports = DoubleDimmerDevice;
