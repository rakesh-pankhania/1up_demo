require('dotenv').config();
const axios = require('axios');
const express = require('express');

const app = express();
const port = 3000;
const staticUserId = 1;

app.set('view engine', 'pug')
app.use(express.urlencoded({extended: false}));

//       let systemLink = `https://api.1up.health/connect/system/clinical/11046?client_id=${process.env.OAUTH_CLIENT_ID}&access_token=${token}`

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
  axios.get('https://api.1up.health/user-management/v1/user', {
    params: {
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET
    }
  }).then((response) => {
    console.log("USERS");
    console.log(response.data.entry);
    res.render('users/index', { users: response.data.entry });
  }).catch((response) => {
    console.log("USERS ERROR");
    console.log(response.data);
    res.send("Error :(");
  });
});

app.post('/users', (req, res) => {
  let appUserId = req.body.applicationUserId

  axios.post('https://api.1up.health/user-management/v1/user', {
    app_user_id: appUserId,
    client_id: process.env.OAUTH_CLIENT_ID,
    client_secret: process.env.OAUTH_CLIENT_SECRET
  }).then((response) => {
    console.log("USER CREATE");
    console.log(response.data);
    res.redirect('/');
  }).catch((response) => {
    console.log("USER CREATE ERROR");
    res.send("Error :(")
  });

  // {
  //   success: true,
  //   code: '280ea50b52848de47fad9f091b3e03d7063f02ef',
  //   oneup_user_id: 123439011,
  //   app_user_id: '1',
  //   active: true
  // }
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
