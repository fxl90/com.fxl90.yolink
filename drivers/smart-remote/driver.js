'use strict';

const YoLinkDriver = require('../../lib/YoLinkDriver');

class SmartRemoteDriver extends YoLinkDriver {

  async onInit() {
    this.triggerButtonPressed = this.homey.flow.getDeviceTriggerCard('smart_remote_button_pressed');
    await super.onInit();
  }

  _getTypeName() {
    return 'SmartRemoter';
  }

}

module.exports = SmartRemoteDriver;
