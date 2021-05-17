const instance = require('../sql/connection');

const getUsers = (req, res) => {
  console.log(`inside the GET /users route`);
  instance.query(`SELECT * FROM users`, function(error, results){
    if(error){
      console.log(`there is an error: ${error}`);
      res.status(500).send(`internal service error`)
    } else {
      res.json(results)
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
      for(i= 0; i < results.length; i++){
        console.log(results[i])
        if(i == 0) {
          user.user_id = results[0].user_id;
          user.user_name = results[0].user_name;
          user.name = results[0].first_name + " " + results[0].last_name;
          user.email = results[0].email;
          // user.genres = []     
        }
        let genre = {};
        genre.genre_id = results[i].genre_id
        genre.genre = results[i].genre
        genres.push(genre)
        // user.genres.push(results[i].genre)
      }
      user.genres = genres;
      res.json(user);
    }
  })
};

const getUserById2 = (req, res) => {
  console.log(`inside the GET /user/user_id route`);
  const sql = `SELECT * from users AS u
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
      
      console.log(results[0])
        
      user.user_id = results[0].user_id;
      user.user_name = results[0].user_name;
      user.name = results[0].first_name + " " + results[0].last_name;
      user.email = results[0].email;
      const sql2 = `SELECT user_genres.genre_id, genre FROM user_genres
      LEFT JOIN genres ON genres.genre_id = user_genres.genre_id
      WHERE user_id = ?;`
      instance.query(sql2, value, function(err, results2){
        if(err){
          console.log(`inside /GET/user/byid route again with new statement`, err)
          res.status(500)
        } else {
          for(i=0; i < results2.length; i++){
            genres.push(results2[i])
          }
          user.genres = genres;
          res.json(user);
        }
      })

      
      
    }

  })
};

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

const getUsersByUserName = (req, res) => {
  console.log(`inside the GET /user/:user_name route`);
  
};

const getUsersByFirstName = (req, res) => {
  console.log(`inside the GET /users/:first_name route`);
  
};

const getUsersByLastName = (req, res) => {
  console.log(`inside the GET /users/:last_name route`);
  
};

const getAllUsersByInstrument = (req, res) => {
  console.log(`inside the GET /users/instruments route`);
  instance.query(`SELECT
  user_name AS 'User Name',
  group_concat(DISTINCT first_name, ' ', last_name) AS 'Name',
  group_concat(instrument) AS 'Preferred Instrument',
  group_concat(DISTINCT user_city, ' ', user_state) AS 'Location',
  email AS Email
  FROM users,
  instruments
  JOIN user_instruments 
  ON user_instruments.instrument_id = instruments.instrument_id
  WHERE
  user_instruments.user_id = users.user_id
  GROUP BY users.first_name`, function(err, results){
        if(err){
          console.log(`there is an error: ${err}`);
          res.status(500).send(`internal service error`)
        } else {
          res.json(results)
        }
    });
  };

const getUsersByGenre = (req, res) => {
  console.log(`inside the GET /users/:genre route`);
};


module.exports = {
  getUsers, 
  getUserById2,
  getUsersByUserName, 
  getUsersByFirstName,
  getUsersByLastName,
  getAllUsersByInstrument,
  getUsersByGenre
};