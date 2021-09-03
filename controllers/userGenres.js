const instance = require('../sql/connection');

const userGenres = (req, res) => {
  console.log("Inside the GET /userGenres route")
  const sql = `SELECT users.user_id, users.user_name, group_concat(DISTINCT genre) AS genres
               FROM users, genres
               JOIN user_genres
               ON user_genres.genre_id = genres.genre_id
               WHERE users.user_id = user_genres.user_id
               GROUP BY users.user_id;`
  instance.query(sql, (error, results) => {
    if(error) {
      console.log("Failed to Fetch User Genres")
      res.status(500).send("Failed to Fetch User Genres")
    } else {
      let userGenres = []
      for(i=0; i<results.length; i++) {
          let user={}
          console.log("yo", results[i].user_name)
          user.user_id = results[i].user_id;
          user.user_name = results[i].user_name;
          user.genres = results[i].genres.split(',')
          userGenres.push(user)  
      }
      res.json(userGenres)
    }
  })
};

const userGenreId = (req, res) => {
  console.log("Inside the GET /userGenres/:id route")
  const { id } = req.params
  const sql = `SELECT users.user_id, users.user_name, group_concat(DISTINCT genre) AS genres
               FROM users, genres
               JOIN user_genres
               ON user_genres.genre_id = genres.genre_id
               WHERE users.user_id = user_genres.user_id
               AND users.user_id = ?
               GROUP BY users.user_id;`
  instance.query(sql, id, (error, results) => {
    if(error) {
      console.log("Failed to Fetch User Genre by Id")
      res.status(500).send("Failed to Fetch Genre by Id")
    } else {
      let userGenres = []
      for(i=0; i<results.length; i++) {
          let user={}
          console.log("yo", results[i].user_name)
          user.user_id = results[i].user_id;
          user.user_name = results[i].user_name;
          user.genres = results[i].genres.split(',')
          userGenres.push(user)  
      }
      res.json(userGenres)
    }
  })
}

const addUserGenre = (req, res) => {
  console.log("Inside PUT /userGenre isntrument route")
  const sql = `INSERT INTO user_genres VALUES (?, ?)`;
  const { id } = req
  const { genre_id } = req.body
  instance.query(sql, [id, genre_id], (err, results) => {
    if(err) {
      console.log("Failed to add Genre")
      res.status(500).send("Failed to add Genre")
    } else {
      res.json("Genre Added")
    }    
  })
}

module.exports = {
  userGenres,
  userGenreId,
  addUserGenre
}