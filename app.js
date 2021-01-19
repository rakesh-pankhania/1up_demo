// Import modules
require('dotenv').config();
const express = require('express');
const { OneUpClient } = require('./modules/one_up_health.js');


// Set global server variables
const app = express();
const oneUpClient = new OneUpClient(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_CLIENT_SECRET);
const port = 3000;


// Generate & seed database stores (kept in memory for now)
const oauthStateStore = {};
const { usersTable, seedUsersFromOneUp } = require('./modules/tables/users.js');
const { connectionsTable, seedConnectionsFromOneUp } = require('./modules/tables/connections.js');
seedUsersFromOneUp(oneUpClient);
seedConnectionsFromOneUp(oneUpClient);


// Configure app
app.set('view engine', 'pug')
app.use(express.urlencoded({extended: false}));


// Set routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/users/new', (req, res) => {
  res.render('users/form');
});

app.get('/users', (req, res) => {
  res.render('users/index', { users: usersTable.getUsers() });
  usersTable.logTable();
});

app.get('/users/:userId', (req, res) => {
  let user = usersTable.getUser(req.params.userId);
  let connections = connectionsTable.getConnections();
  let userAccessToken = user.access_token;

  // Generate access token if necessary
  if (!userAccessToken) {
    oneUpClient.getToken(user.app_user_id).then((responseToken) => {
      userAccessToken = responseToken;

      // Save token in DB to easily grab in future requests
      usersTable.updateUser(user.app_user_id, { access_token: userAccessToken });

      res.render('users/show', { userAccessToken , connections, userId: user.app_user_id });
    }).catch((response) => {
      res.send('Error :(');
      console.error(response);
    });
  }
  else {
    res.render('users/show', { userAccessToken , connections, userId: user.app_user_id });
  }
});

app.post('/users', (req, res) => {
  oneUpClient.createUser(req.body.applicationUserId).then((user) => {
    usersTable.addUser(user);
    res.redirect('/users')
  }).catch((response) => {
    res.send('Error :(');
    console.error(response);
  });
});

app.get('/users/:userId/connections/:connectionId', (req, res) => {
  let user = usersTable.getUser(req.params.userId);
  let connection = connectionsTable.getConnection(req.params.connectionId);

  // Generate state and save to store
  let state = Math.random().toString(20).substr(2, 6);
  oauthStateStore[state] = {
    redirectUrl: `/users/${user.app_user_id}`
  }

  // Redirect user to auth connection URL
  let redirectUrl = oneUpClient.connectPatientUrl(connection.id, user.access_token, state);
  res.redirect(redirectUrl);
});

app.get('/oauth/callback', (req, res) => {
  if (req.query.success == 'true') {
    let stateInfo = oauthStateStore[req.query.state].redirectUrl;
    res.redirect(redirectUrl);
  }
  else {
    console.log(req);
    res.send('Could not authenticate with connection');
  }
});

app.get('/users/:userId/patients', (req, res) => {
  let user = usersTable.getUser(req.params.userId);
  let userAccessToken = user.access_token;

  oneUpClient.getPatients(userAccessToken).then((patients) => {
    res.render('patients/index', { user, patients });
  }).catch((response) => {
    res.send('Error :(');
    console.error(response);
  });
});

app.get('/users/:userId/patients/:patientId/everything', (req, res) => {
  let user = usersTable.getUser(req.params.userId);
  let patientId = req.params.patientId
  let userAccessToken = user.access_token;

  oneUpClient.getPatientEverything(userAccessToken, patientId).then((everything) => {
    res.render('patients/everything', { user, patientId, everything })
  }).catch((response) => {
    res.send('Error :(');
    console.error(response);
  });
});


// Run server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
