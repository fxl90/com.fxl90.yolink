'use strict';

class YoLinkAPI {

  constructor(hubIP, clientId, clientSecret) {
    this.hubIP = hubIP;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.baseUrl = `http://${hubIP}:1080`;
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = 0;
  }

  async authenticate() {
    await this._fetchToken('client_credentials');
  }

  async _fetchToken(grantType) {
    let body;
    if (grantType === 'client_credentials') {
      body = `grant_type=client_credentials&client_id=${encodeURIComponent(this.clientId)}&client_secret=${encodeURIComponent(this.clientSecret)}`;
    } else {
      body = `grant_type=refresh_token&refresh_token=${encodeURIComponent(this.refreshToken)}`;
    }

    const response = await this._post('/open/yolink/token', body, 'application/x-www-form-urlencoded');

    if (!response.access_token) {
      throw new Error('No access_token in response');
    }

    this.accessToken = response.access_token;
    this.refreshToken = response.refresh_token || null;
    this.tokenExpiry = Date.now() + (response.expires_in - 30) * 1000;
  }

  async _ensureToken() {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return;
    }

    if (this.refreshToken) {
      try {
        await this._fetchToken('refresh_token');
        return;
      } catch (err) {
        // Fall through to full re-auth
      }
    }

    await this._fetchToken('client_credentials');
  }

  async request(method, targetDevice, token, params) {
    await this._ensureToken();

    const body = {
      method,
      ...(targetDevice && { targetDevice }),
      ...(token && { token }),
      ...(params && Object.keys(params).length > 0 && { params }),
    };

    const response = await this._post(
      '/open/yolink/v2/api',
      JSON.stringify(body),
      'application/json',
      { Authorization: `Bearer ${this.accessToken}` }
    );

    if (response.code !== '000000') {
      throw new Error(`YoLink API error: ${response.code} - ${response.desc || 'Unknown error'}`);
    }

    return response.data;
  }

  async getDeviceList() {
    const result = await this.request('Home.getDeviceList');
    const list = Array.isArray(result) ? result : (result?.devices ?? []);
    return list;
  }

  async _post(path, body, contentType, headers) {
    const url = `${this.baseUrl}${path}`;
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        ...headers,
      },
      body,
      signal: AbortSignal.timeout(8000),
    };

    let response;
    try {
      response = await fetch(url, fetchOptions);
    } catch (err) {
      throw new Error(`Network error for ${path}: ${err.message}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${path}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error(`Invalid JSON response from ${path}`);
    }

    return data;
  }

}

module.exports = YoLinkAPI;
