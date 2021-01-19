const axios = require('axios');
const ONE_UP_ROOT_URL = 'https://api.1up.health';

// let systemLink = `https://api.1up.health/connect/system/clinical/11046?client_id=${process.env.OAUTH_CLIENT_ID}&access_token=${token}`

class OneUpClient {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  setToken(token) {
    this.token = token;
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


}

module.exports.OneUpClient = OneUpClient;
