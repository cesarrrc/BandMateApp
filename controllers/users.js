const instance = require('../sql/connection');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const jwtSecret = "superSecret";

const loginUser = (req, res) => {
  console.log("Inside the POST /login route to access token");
  const userName = req.body.user_name;
  const password = req.body.password;
  console.log('this is the entered password: ' + password)
  instance.query("SELECT user_name, login_pwd FROM users WHERE user_name = ?", userName, (err, rows) => {
    console.log(rows)
    let goodPassword = true;

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
      console.log(`this is the result of the 'good password: ` + goodPassword)
    }

    if(goodPassword){
      const unsignedToken = {
        user_name: userName
      }

      const accessToken = jwt.sign(unsignedToken, jwtSecret)
      res.json(accessToken)

    } else{
      res.status(401).send("Unauthorized")
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
  console.log(`inside the GET /user/user_id route`);
  const sql = `SELECT * from users AS u
  LEFT JOIN user_genres AS ug
  ON u.user_id = ug.user_id
  LEFT JOIN genres As g
  on ug.genre_id = g.genre_id
  WHERE u.user_id = ?;`
  const value = [req.params.user_id]
  console.log(`inside the GET /user/user_id route and this is: ${sql}`);
  instance.query(sql, value, function(err, results){
    if (err) {
      console.log(err);
      res.status(500)
    } else {
      let user = {};
      let genres = [];
      let instruments = [];
      for(i= 0; i < results.length; i++){
        console.log(results[i])
        if(i == 0) {
          user.user_id = results[0].user_id;
          user.user_name = results[0].user_name;
          user.name = results[0].first_name + " " + results[0].last_name;
          user.email = results[0].email;
        }
        let genre = {};
        genre.genre_id = results[i].genre_id
        genre.genre = results[i].genre
        genres.push(genre)
      }

      sql2 = `SELECT user_instruments.instrument_id, instrument
      FROM user_instruments
      LEFT JOIN instruments ON instruments.instrument_id = user_instruments.instrument_id
      WHERE user_id = ?`
      
      instance.query(sql2, value, function(err, results2){
        if(err){
          console.log(`inside 2nd query in GET user/genres/instruments route by ID`)
          res.status(500)
        } else {
          
          for(i=0; i < results2.length; i++){
            let instrument = {};
            instrument.instrument_id = results2[i].instrument_id;
            instrument.instrument = results2[i].instrument;
            // console.log(`this is current i: ` + results2[i].instrument)
            instruments.push(instrument)
            // console.log(instrument)
          }
          
          console.log(instruments)
        }
      })
      console.log(instruments)
      user.genres = genres;
      user.instruments = instruments;
      // console.log(`this is your instruments: ` + instruments)
      res.json(user);
    }
  })
};

const getUsersByUserName = (req, res) => {
  console.log(`inside the GET /user/:user_name route`);
  
};

const getUsersByFirstName = (req, res) => {
  console.log(`inside the GET /users/:first_name route`);
  
};

const getUsersByLastName = (req, res) => {
  console.log(`inside the GET /users/:last_name route`);
  
};


const getUsersByGenre = (req, res) => {
  console.log(`inside the GET /users/:genre route`);
};

const createUser = (req, res) => {
  console.log("inside the Post /createUser route crating User: " + req.body.user_name);
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
  let passwordHash = bCrypt.hashSync(password, 10);
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
      res.json("userCreated")
    }
  })
}


module.exports = {
  loginUser,
  getUsers, 
  getUserById,
  getUsersByUserName, 
  getUsersByFirstName,
  getUsersByLastName,
  // getAllUsersByInstrument,
  getUsersByGenre,
  createUser
  
  
  // const getUserById2 = (req, res) => {
  //   console.log(`inside the GET /user/user_id route`);
  //   const sql = `SELECT * from users AS u
  //     WHERE u.user_id = ?;`
  //   const value = [req.params.user_id];
  //   console.log(`inside the GET /user/user_id route and this is: ${sql}`);
  //   instance.query(sql, value, function(err, results){
  //     if (err) {
  //       console.log(err);
  //       res.status(500);
  //     } else {
  //       let user = {};
  //       let genres = [];
        
  //       console.log(results[0]);
          
  //       user.user_id = results[0].user_id;
  //       user.user_name = results[0].user_name;
  //       user.name = results[0].first_name + " " + results[0].last_name;
  //       user.email = results[0].email;
  //       const sql2 = `SELECT user_genres.genre_id, genre FROM user_genres
  //       LEFT JOIN genres ON genres.genre_id = user_genres.genre_id
  //       WHERE user_id = ?;`
  //       instance.query(sql2, value, function(err, results2){
  //         if(err){
  //           console.log(`inside /GET/user/byid route again with new statement`, err);
  //           res.status(500);
  //         } else {
  //           for(i=0; i < results2.length; i++){
  //             genres.push(results2[i]);
  //           }
  //           user.genres = genres;
  //           res.json(user);
  //         }
  //       });
  //     }
  //   });
  // };
  
  // const getUserById = (req, res) => {
  //   console.log(`inside the GET /user/user_id route`);
  //   instance.query(`SELECT
  //   user_name AS 'User Name',
  //   group_concat(DISTINCT first_name, ' ', last_name) AS 'Name',
  //   group_concat(DISTINCT instrument) AS 'Preferred Instrument',
  //   group_concat(DISTINCT genre) AS 'Preffered Genre',
  //   group_concat(DISTINCT user_city, ' ', user_state) AS 'Location',
  //   email AS 'Email'
  //   FROM users,
  //   instruments
  //   JOIN user_instruments
  //   ON user_instruments.instrument_id = instruments.instrument_id,
  //   genres
  //   JOIN user_genres
  //   ON user_genres.genre_id = genres.genre_id
  //   WHERE
  //   users.user_id = '${req.params.user_id}'
  //   AND
  //   users.user_id = user_instruments.user_id
  //   AND 
  //   users.user_id = user_genres.user_id
  //   GROUP BY users.first_name`, function(err, results){
  //     if(err){
  //       console.log(`there is an error: ${err}`);
  //       res.status(500).send(`internal service error`)
  //     } else {
  //       res.json(results)
  //     }
  //   })
  // };
  
  // const getAllUsersByInstrument = (req, res) => {
  //   console.log(`inside the GET /users/instruments route`);
  //   instance.query(`SELECT
  //   user_name AS 'User Name',
  //   group_concat(DISTINCT first_name, ' ', last_name) AS 'Name',
  //   group_concat(instrument) AS 'Preferred Instrument',
  //   group_concat(DISTINCT user_city, ' ', user_state) AS 'Location',
  //   email AS Email
  //   FROM users,
  //   instruments
  //   JOIN user_instruments 
  //   ON user_instruments.instrument_id = instruments.instrument_id
  //   WHERE
  //   user_instruments.user_id = users.user_id
  //   GROUP BY users.first_name`, function(err, results){
  //         if(err){
    //           console.log(`there is an error: ${err}`);
    //           res.status(500).send(`internal service error`)
    //         } else {
      //           res.json(results)
      //         }
      //     });
      //   };
    };