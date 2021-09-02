const instance = require('../sql/connection');

const addUserGenre = (req, res) => {
  console.log("Inside Genre isntrument route")
  const sql = `INSERT INTO user_genres VALUES (?, ?)`;
  const { user_id, genre_id } = req.body
  instance.query(sql, [user_id, genre_id], (err, results) => {
    if(err) {
      console.log("Failed to add Genre")
      res.status(500).send("Failed to add Genre")
    } else {
      res.json("Genre Added")
    }    
  })
}

module.exports = {
  addUserGenre
}