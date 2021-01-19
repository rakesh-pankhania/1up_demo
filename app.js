// Import modules
require('dotenv').config();
const express = require('express');
const { OneUpClient } = require('./modules/one_up_health.js');


// Set global server variables
const app = express();
const oneUpClient = new OneUpClient(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_CLIENT_SECRET);
const port = 3000;


// Generate & seed database tables (kept in memory for now)
const { usersTable, seedUsersFromOneUp } = require('./modules/tables/users.js');
const { connectionTable, seedConnectionsFromOneUp } = require('./modules/tables/connections.js');
seedUsersFromOneUp(oneUpClient);
seedConnectionsFromOneUp(oneUpClient);


// Configure app
app.set('view engine', 'pug')
app.use(express.urlencoded({extended: false}));


// Set routes
app.get('/', (req, res) => {
  res.render('index');
})

app.get('/users/new', (req, res) => {
  res.render('users/form');
});

app.get('/users', (req, res) => {
  console.log(usersTable);
  res.render('users/index', { users: Object.values(usersTable) });
});

app.get('/users/:userId', (req, res) => {
  let userId = req.params.userId;
  let userAccessToken = usersTable[userId].access_token;

  if (!userAccessToken) {
    oneUpClient.getToken(userId).then((userAccessToken) => {
      usersTable[userId].access_token = userAccessToken;

      let connectionsWithUrl = connections.map(conn => {
        return {...conn, url: oneUpClient.connectPatientUrl(conn.id, userAccessToken)};
      })

      res.render('users/show', { userId, userAccessToken, connections: connectionsWithUrl });
    }).catch((response) => {
      res.send("Error :(");
    });
  }
  else {
    let connectionsWithUrl = connections.map(conn => {
      return {...conn, url: oneUpClient.connectPatientUrl(conn.id, userAccessToken)};
    })

    res.render('users/show', { userId, userAccessToken });
  }
})

app.post('/users', (req, res) => {
  oneUpClient.createUser(req.body.applicationUserId).then((user) => {
    usersTable[user.id] = user
    res.redirect('/users')
  }).catch((response) => {
    res.send("Error :(")
  });
});


// Run server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
