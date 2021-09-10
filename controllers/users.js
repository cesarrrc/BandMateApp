const instance = require('../sql/connection');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const jwtSecret = "superSecret";

const loginUser = (req, res) => {
  console.log("Inside the POST /login route to access token");
  const userName = req.body.user_name;
  const password = req.body.password;
  instance.query("SELECT user_id, user_name, login_pwd FROM users WHERE user_name = ?", userName, (err, rows) => {
    console.log(rows)
    let goodPassword = true;
    let id = rows[0].user_id
    if(err){
      console.error("Error when querying the db" + err);
    }
    if(rows.length > 1){
      console.error("Error, too many rows with the same UserName" + userName)
    };
    if(rows.length == 0)(
      console.error("Did not find a row with the UserName " + userName)
    )
    if(!err && rows.length == 1){
      console.log('row password results before password hash compare: ' + rows[0].login_pwd)
      
      let hash = rows[0].login_pwd
      
      goodPassword = bcrypt.compareSync(password, hash)
      console.log(`this is the result of the 'good password': ` + goodPassword)
    }

    if(goodPassword){
      const unsignedToken = {
        userName: userName,
        id: id  
      }
      const accessToken = jwt.sign(unsignedToken, jwtSecret) //string
      res.json({accessToken, userName, id});
    } else{
      res.status(401).send("Username and/or Password are incorrect")
    }
  })
}

const getUserInfo = (req, res) => {
  console.log(`inside the GET /userInfo route`)
  const sql = `SELECT * FROM users`
  instance.query(sql, (error, results) => {
    if(error){
      console.log(`there is an error: ${error}`)
      res.status(500).send(`internal service error`)
    } else {
      let users = []
      for(i=0; i < results.length; i++) {
        let user = {}
          user.userName = results[i].user_name
          user.firstName = results[i].first_name
          user.lastName = results[i].last_name
          user.email = results[i].email
          user.mobileNumber = results[i].mobile_number
          user.password = results[i].login_pwd
          user.state = results[i].user_state
          user.city = results[i].user_city
        users.push(user)
      }    
      res.json(users)
    }
  })
}

const getUserInfoById = (req, res) => {
  console.log(`inside the GET /user/:id route`)
  const { id } = req.params
  const sql = `SELECT * FROM users WHERE user_id = ?`
  instance.query(sql, id, (error, results) => {
    if(error){
      console.log(`there is an error: ${error}`)
      res.status(500).send(`internal service error`)
    } else {
      let user = {}
        user.userName = results[0].user_name
        user.firstName = results[0].first_name
        user.lastName = results[0].last_name
        user.email = results[0].email
        user.mobileNumber = results[0].mobile_number
        user.password = results[0].login_pwd
        user.state = results[0].user_state
        user.city = results[0].user_city
    console.log(results[0])
    
    res.json(user)
    }
  })
}

const getUsers = (req, res) => {
  console.log(`inside the GET /users route`);
  const sql = `SELECT
              users.user_id,
              users.user_name,
              users.first_name,
              users.last_name,
              users.email,
              users.mobile_number,
              users.user_state,
              users.user_city,
              group_concat(DISTINCT instrument) AS instruments,
              group_concat(DISTINCT genre) AS genres
              FROM users,
              instruments
              JOIN user_instruments
              ON user_instruments.instrument_id = instruments.instrument_id,
              genres
              JOIN user_genres
              ON user_genres.genre_id = genres.genre_id
              WHERE
              users.user_id = user_instruments.user_id
              AND 
              users.user_id = user_genres.user_id
              GROUP BY users.first_name
              ;`
  instance.query(sql, function(error, results){
    console.log(results)
      if(error){
        console.log(`there is an error: ${error}`);
        res.status(500).send(`internal service error`)
      } else {
        let users = [];
        
        for (i=0; i < results.length; i++){
          let user = {}
            user.user_id = results[i].user_id;
            user.user_name = results[i].user_name;
            user.first_name = results[i].first_name;
            user.last_name = results[i].last_name;
            user.email = results[i].email;
            user.mobile_number = results[i].mobile_number;
            user.user_state = results[i].user_state;
            user.user_city = results[i].user_city;
            user.instruments = results[i].instruments.split(',')
            user.genres = results[i].genres.split(',')
          users.push(user)
        }       
        res.json(users)
      }
    })
};

const getUserById = (req, res) => {
  console.log(`inside the GET /users/:id route`);
  const { id } = req.params
  const sql = `SELECT
              users.user_id,
              users.user_name,
              users.first_name,
              users.last_name,
              users.email,
              users.mobile_number,
              users.user_state,
              users.user_city,
              group_concat(DISTINCT instrument) AS instruments,
              group_concat(DISTINCT genre) AS genres
              FROM users,
              instruments
              JOIN user_instruments
              ON user_instruments.instrument_id = instruments.instrument_id,
              genres
              JOIN user_genres
              ON user_genres.genre_id = genres.genre_id
              WHERE
              users.user_id = user_instruments.user_id
              AND 
              users.user_id = user_genres.user_id
              AND users.user_id = ?
              GROUP BY users.first_name
              ;`
  instance.query(sql, id, function(error, results){
    console.log(results)
      if(error){
        console.log(`there is an error: ${error}`);
        res.status(500).send(`internal service error`)
      } else {
        let users = [];
        
        for (i=0; i < results.length; i++){
          let user = {}
            user.user_id = results[i].user_id;
            user.user_name = results[i].user_name;
            user.first_name = results[i].first_name;
            user.last_name = results[i].last_name;
            user.email = results[i].email;
            user.mobile_number = results[i].mobile_number;
            user.user_state = results[i].user_state;
            user.user_city = results[i].user_city;
            user.instruments = results[i].instruments.split(',')
            user.genres = results[i].genres.split(',')
          users.push(user)
        }       
        res.json(users)
      }
    })
};

const createUser = (req, res, next) => {
  console.log("inside the Post /createUser route creating User: " + req.body.user_name);
  let userName = req.body.user_name;
  let firstName = req.body.first_name;
  let lastName = req.body.last_name;
  let email = req.body.email;
  let mobileNumber = req.body.mobile_number
  let password = req.body.password
  let confirmPassword = req.body.confirm_password;
  let state = req.body.state;
  let city = req.body.city
  if(password !== confirmPassword){
    return res.status(400).send("Passwords do not match");
  }
  let passwordHash = bcrypt.hashSync(password, 10);
  let sql = "INSERT INTO users VALUES (user_id, ?, ?, ?, ?, ?, ?, ?, ?)";
  instance.query(sql, [
    userName, 
    firstName, 
    lastName, 
    email, 
    mobileNumber, 
    passwordHash, 
    state, 
    city
  ], (err, rows) => {
    if(err){
      console.log("Failed to add user" + err);
      res.status(500).send("Failed to add user")
    } else{
    }
    next()
  })
}

const deleteUser = (req, res) => {
  console.log(`Inside the /DELETE/:id user by ID route`)
  let {id} = req.params
  let sql = `DELETE FROM users WHERE user_id = ${id}`;
  
  if(req.id == id) {
    instance.query(sql, function(err){
      if(err){
        console.log(`there is an error: ` + error);
        res.status(500).send(error.message)
        console.log(error)
      }
      res.send(`Succesfully deleted user: ${id}`)
    })

  }
};



module.exports = {
  loginUser,
  getUsers,
  getUserById,
  getUserInfo, 
  getUserInfoById,
  deleteUser,
  createUser
}