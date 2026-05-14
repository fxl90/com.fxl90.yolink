'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class SmartRemoteDriver extends YoLinkDriver {

  async onInit() {
    this.triggerButtonPressed = this.homey.flow.getDeviceTriggerCard('smart_remote_button_pressed');

    this.triggerButtonPressed.registerRunListener(async (args, state) => {
      const buttonMatch = args.button === 'any' || Number(args.button) === Number(state.button);
      const actionMatch = args.action === 'any' || String(args.action) === String(state.action);
      return buttonMatch && actionMatch;
    });

    await super.onInit();
  }

  _getTypeName() { return 'SmartRemoter'; }

}

module.exports = SmartRemoteDriver;
