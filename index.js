const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const users = require('./routes/users')

app.use(bodyParser.json());
app.use(users)

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  console.log('Inside base GET route')
  res.send(`Welcome to my App: BandMate`)
}) 

app.listen(port, () => {
  console.log(`Web Server is listening on port ${port}`)
})