const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const users = require('./routes/users');
const posts = require('./routes/posts');
const replies = require('./routes/replies');
const userInstruments = require('./routes/userInstruments')
const userGenres = require('./routes/userGenres')
const midWare = require('./middleware/authentication');

app.use(cors())
app.use(bodyParser.json());
app.use(users);
app.use(posts);
app.use(replies);
app.use(userInstruments)
app.use(userGenres)


const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  console.log('Inside base GET route')
  res.send(`Welcome to my App: BandMate`)
});

app.get("/login", midWare.checkJwt, (req,res) => {
  console.log('Inside GET /login route with authentication')
  res.json("You are logged in as: " + req.userName)
})

app.listen(port, () => {
  console.log(`Web Server is listening on port ${port}`)
})