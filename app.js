'use strict';

const Homey = require('homey');
const mqtt = require('mqtt');
const YoLinkAPI = require('./lib/YoLinkAPI');

class YoLinkApp extends Homey.App {

  async onInit() {
    this._api = null;
    this._mqttClient = null;
    this._devices = new Map();

    await this._connect();

    this.homey.settings.on('set', (key) => {
      if (['hub_ip', 'client_id', 'client_secret', 'subnet_id'].includes(key)) {
        this._connect().catch(err => this.error('Reconnect failed:', err.message));
      }
    });

    this.log('YoLink app initialized');
  }

  async onUninit() {
    this._disconnectMQTT();
  }

  async _connect() {
    const hubIP = this.homey.settings.get('hub_ip');
    const clientId = this.homey.settings.get('client_id');
    const clientSecret = this.homey.settings.get('client_secret');
    const subnetId = this.homey.settings.get('subnet_id');

    if (!hubIP || !clientId || !clientSecret) {
      this._api = null;
      this.log('Hub settings not configured');
      return;
    }

    try {
      this._api = new YoLinkAPI(hubIP, clientId, clientSecret);
      await this._api.authenticate();
      this.log('YoLink API authenticated successfully');

      if (subnetId) {
        this._connectMQTT(hubIP, clientId, clientSecret, subnetId);
      }
    } catch (err) {
      this.error('Failed to connect to YoLink hub:', err.message);
      this._api = null;
    }
  }

  _connectMQTT(hubIP, clientId, clientSecret, subnetId) {
    this._disconnectMQTT();

    const client = mqtt.connect(`mqtt://${hubIP}:18080`, {
      username: clientId,
      password: clientSecret,
      reconnectPeriod: 5000,
      connectTimeout: 8000,
    });

    client.on('connect', () => {
      this.log('MQTT connected');
      const topic = `ylsubnet/${subnetId}/+/report`;
      client.subscribe(topic, (err) => {
        if (err) {
          this.error('MQTT subscribe error:', err.message);
        } else {
          this.log(`MQTT subscribed to ${topic}`);
        }
      });
    });

    client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        const deviceId = payload.deviceId;
        if (!deviceId) return;

        const device = this._devices.get(deviceId);
        if (device) {
          device.processMQTTMessage(payload);
        }
      } catch (err) {
        this.error('MQTT message parse error:', err.message);
      }
    });

    client.on('error', (err) => {
      this.error('MQTT error:', err.message);
    });

    client.on('offline', () => {
      this.log('MQTT offline');
    });

    client.on('reconnect', () => {
      this.log('MQTT reconnecting...');
    });

    this._mqttClient = client;
  }

  _disconnectMQTT() {
    if (this._mqttClient) {
      this._mqttClient.end(true);
      this._mqttClient = null;
      this.log('MQTT disconnected');
    }
  }

  getAPI() {
    return this._api;
  }

  registerDevice(deviceId, device) {
    this._devices.set(deviceId, device);
  }

  unregisterDevice(deviceId) {
    this._devices.delete(deviceId);
  }

}

module.exports = YoLinkApp;
