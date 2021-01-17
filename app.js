require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'pug')

// process.env.OAUTH_CLIENT_ID
// process.env.OAUTH_CLIENT_SECRET

app.get('/', (req, res) => {
  // res.send('Hello World!');
  res.render('index', { title: 'Welcome', message: 'Hello World!' });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
