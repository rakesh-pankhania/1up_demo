const axios = require('axios');
const ONE_UP_ROOT_URL = 'https://api.1up.health';

class OneUpClient {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  /*
    Authentication (OAuth2)
    https://1up.health/docs/api/auth/reference
  */

  getToken(userId) {
    return new Promise((resolve, reject) => {
      // Generate user authorization code
      axios.post(`${ONE_UP_ROOT_URL}/user-management/v1/user/auth-code`, {
        app_user_id: userId,
        client_id: this.clientId,
        client_secret: this.clientSecret
      }).then((codeResponse) => {
        // Get access token
        axios.post(`${ONE_UP_ROOT_URL}/fhir/oauth2/token`, {
          grant_type: 'authorization_code',
          code: codeResponse.data.code,
          client_id: this.clientId,
          client_secret: this.clientSecret
        }).then((tokenResponse) => {
          resolve(tokenResponse.data.access_token);
        }).catch((response) => {
          console.error('1up client getToken() token error');
          console.error(response);
          reject(response);
        });
      }).catch((response) => {
        console.error('1up client getToken() code error');
        console.error(response);
        reject(response);
      });
    })
  }

  /*
    User Management
    https://1up.health/docs/api/user-management/reference
  */

  getUsers() {
    return new Promise((resolve, reject) => {
      axios.get(`${ONE_UP_ROOT_URL}/user-management/v1/user`, {
        params: {
          client_id: this.clientId,
          client_secret: this.clientSecret
        }
      }).then((response) => {
        resolve(response.data.entry);
      }).catch((response) => {
        console.error('1up client getUsers() error');
        console.error(response);
        reject(response);
      })
    });
  }

  createUser(appUserId) {
    return new Promise((resolve, reject) => {
      axios.post(`${ONE_UP_ROOT_URL}/user-management/v1/user`, {
        app_user_id: appUserId,
        client_id: this.clientId,
        client_secret: this.clientSecret
      }).then((response) => {
        resolve(response.data);
      }).catch((response) => {
        console.error('1up client createUser() error');
        console.error(response)
        reject(response);
      });
    });
  }

  /*
    Connect (Patient)
    https://1up.health/docs/api/connect-patient/reference
  */

  connectPatientUrl(healthSystemId, userToken) {
    return `${ONE_UP_ROOT_URL}/connect/system/clinical/${healthSystemId}?client_id=${this.clientId}&access_token=${userToken}`;
  }
}

module.exports.OneUpClient = OneUpClient;
