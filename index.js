const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const users = require('./routes/users');
const posts = require('./routes/posts');
const replies = require('./routes/replies');
const midWare = require('./middleware/authentication');

app.use(cors())
app.use(bodyParser.json());
app.use(users);
app.use(posts);
app.use(replies);

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  console.log('Inside base GET route')
  res.send(`Welcome to my App: BandMate`)
});

app.get("/login", midWare.checkJwt, (req,res) => {
  console.log('Inside GET /login route with authentication')
  res.json("You are logged in as: " + req.user_name)
})

// app.post("/login", (req, res) => {
//   console.log("Inside the POST /login route to access token");
//   const userName = req.body.user_name;
//   const password = req.body.password;
//   console.log('this is the entered password: ' + password)
//   instance.query("SELECT user_name, login_pwd FROM users WHERE user_name = ?", userName, (err, rows) => {
//     console.log(rows)
//     let goodPassword = true;

//     if(err){
//       console.error("Error when querying the db" + err);
//     }
//     if(rows.length > 1){
//       console.error("Error, too many rows with the same UserName" + userName)
//     };
//     if(rows.length == 0)(
//       console.error("Did not find a row with the UserName " + userName)
//     )
//     if(!err && rows.length == 1){
//       console.log('row password results before password hash compare: ' + rows[0].login_pwd)
      
//       let hash = rows[0].login_pwd
      
//       goodPassword = bcrypt.compareSync(password, hash)
//       console.log(`this is the result of the 'good password: ` + goodPassword)
//     }

//     if(goodPassword){
//       const unsignedToken = {
//         user_name: userName
//       }

//       const accessToken = jwt.sign(unsignedToken, jwtSecret)
//       res.json(accessToken)

//     } else{
//       res.status(401).send("Unauthorized")
//     }
//   })
// })

app.listen(port, () => {
  console.log(`Web Server is listening on port ${port}`)
})