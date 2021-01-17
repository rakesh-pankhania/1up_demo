require('dotenv').config();
const axios = require('axios');
const express = require('express');

const app = express();
const port = 3000;
app.set('view engine', 'pug')

//       let systemLink = `https://api.1up.health/connect/system/clinical/11046?client_id=${process.env.OAUTH_CLIENT_ID}&access_token=${token}`

app.get('/', (req, res) => {
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
    res.render('index', { title: 'Welcome', message: 'Hello World!', token: "ERROR" });
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
