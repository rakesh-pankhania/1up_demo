// Import modules
require('dotenv').config();
const express = require('express');
const { OneUpClient } = require('./modules/one_up_health.js');

// Set global server variables
const app = express();
const oneUpClient = new OneUpClient(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_CLIENT_SECRET);
const port = 3000;

// Generate mock database tables
let userTokenMap = [];
let connections = [
  {
    id: 4707,
    name: 'Cerner Health Systems (demo)',
    logo: 'https://1uphealth-assets.s3-us-west-2.amazonaws.com/systems/cerner.png'
  }
];

app.set('view engine', 'pug')
app.use(express.urlencoded({extended: false}));


// Dashboard route

app.get('/', (req, res) => {
  res.render('index');
})


// User Routes

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

app.get('/users/:userId', (req, res) => {
  let userId = req.params.userId;
  let userToken = userTokenMap[userId];

  if (!userToken) {
    oneUpClient.getToken(userId).then((userToken) => {
      userTokenMap[userId] = userToken;

      let connectionsWithUrl = connections.map(conn => {
        return {...conn, url: oneUpClient.connectPatientUrl(conn.id, userToken)};
      })

      res.render('users/show', { userId, userToken, connections: connectionsWithUrl });
    }).catch((response) => {
      res.send("Error :(");
    });
  }
  else {
    let connectionsWithUrl = connections.map(conn => {
      return {...conn, url: oneUpClient.connectPatientUrl(conn.id, userToken)};
    })

    res.render('users/show', { userId, userToken });
  }
})

app.post('/users', (req, res) => {
  oneUpClient.createUser(req.body.applicationUserId).then((user) => {
    res.redirect('/users')
  }).catch((response) => {
    res.send("Error :(")
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
