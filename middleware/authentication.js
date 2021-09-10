const instance = require('../sql/connection')
const jwt = require('jsonwebtoken');
const jwtSecret = "superSecret";

const checkJwt = (req, res, next) => {
  console.log("processing JWT authentication check");

  let token;
  if(req.headers.authorization){
    let bearer = req.headers.authorization.split(" ");
    token = bearer[1]
  } else{
    token = null;
  }
  if(!token){
    res.status(401).send("Unauthorized!!!");
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if(err){
      console.log("Did not verify jwt" + err);
      return res.status(401).send("Unauthorized!")
    }

    console.log(decoded);
    //req - had info about the post that you were to create
    //by decoding the token we know who made the request
    req.userName = decoded.userName;
    req.id = decoded.id
    next()
  })
}

module.exports = {checkJwt}