const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const users = require('./routes/users');
const posts = require('./routes/posts');
const replies = require('./routes/replies');

app.use(bodyParser.json());
app.use(users);
app.use(posts);
app.use(replies);

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  console.log('Inside base GET route')
  res.send(`Welcome to my App: BandMate`)
}) 

app.listen(port, () => {
  console.log(`Web Server is listening on port ${port}`)
})