require('dotenv').config();
// TODO: Remove Axios
const axios = require('axios');
const express = require('express');
const { OneUpClient } = require('./modules/one_up_client.js');

const app = express();
const oneUpClient = new OneUpClient(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_CLIENT_SECRET);
const port = 3000;

app.set('view engine', 'pug')
app.use(express.urlencoded({extended: false}));

// TODO: Move users around
const staticUserId = 1;

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/connections', (req, res) => {
  let userAccessToken;

  axios.post('https://api.1up.health/user-management/v1/user/auth-code', {
    app_user_id: staticUserId,
    client_id: process.env.OAUTH_CLIENT_ID,
    client_secret: process.env.OAUTH_CLIENT_SECRET
  }).then((codeResponse) => {
    let code = codeResponse.data.code

    axios.post('https://api.1up.health/fhir/oauth2/token', {
      grant_type: 'authorization_code',
      code: code,
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET
    }).then((tokenResponse) => {
      console.log(tokenResponse.data);
      userAccessToken = tokenResponse.data.access_token

      let connections = [
        {
          "id": 4707,
          "name": "Cerner Health Systems (demo)",
          "logo": "https://1uphealth-assets.s3-us-west-2.amazonaws.com/systems/cerner.png",
          "url": `https://api.1up.health/connect/system/clinical/4707?client_id=${process.env.OAUTH_CLIENT_ID}&access_token=${userAccessToken}`
        }
      ];

      console.log(connections);

      res.render('connections/index', { connections });
    });
  });
});

/*
  User Management
*/

app.get('/users/new', (req, res) => {
  res.render('users/form');
});

app.get('/users', (req, res) => {
  oneUpClient.getUsers().then((users) => {
    res.render('users/index', { users });
  }).catch((response) => {
    res.send("Error :(");
  });
});

app.post('/users', (req, res) => {
  oneUpClient.createUser(req.body.applicationUserId).then((user) => {
    res.redirect('/users')
  }).catch((response) => {
    res.send("Error :(")
  });
});

app.get('/kitchen_sink', (req, res) => {
  let code;
  let staticUserId = 'demo'

  // Get access token (POST auth-code, POST token)
  axios.post('https://api.1up.health/user-management/v1/user/auth-code', {
    app_user_id: staticUserId,
    client_id: process.env.OAUTH_CLIENT_ID,
    client_secret: process.env.OAUTH_CLIENT_SECRET
  }).then((codeResponse) => {
    let code = codeResponse.data.code

    axios.post('https://api.1up.health/fhir/oauth2/token', {
      grant_type: 'authorization_code',
      code: code,
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET
    }).then((tokenResponse) => {
      console.log(tokenResponse.data);
      res.render('index', { title: 'Welcome', message: 'Hello World!', token: tokenResponse.data.access_token });
    }).catch((response) => {
      console.log("TOKEN ERROR");
      console.log(response.data);
      res.render('index', { title: 'Welcome', message: 'Hello World!', token: "ERROR" });
    });
  }).catch((response) => {
    console.log("CODE ERROR");
    console.log(response.data);
    res.render('kitchen_sink', { title: 'Welcome', message: 'Hello World!', token: "ERROR" });
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
