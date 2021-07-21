const instance = require('../sql/connection');

const getAllPosts = (req, res) => {
  console.log('inside my GET all posts route')
  instance.query(
    `SELECT users.user_name, 
    instruments.instrument, 
    genres.genre, 
    post_type.post_type,
    posts.post_title, 
    posts.post_detail, 
    posts.created_on
    FROM
    posts
    JOIN users
    ON users.user_id = posts.user_id
    JOIN instruments
    ON instruments.instrument_id = posts.instrument_id
    JOIN genres
    ON genres.genre_id = posts.genre_id
    JOIN post_type
    ON post_type.post_type_id = posts.post_type
    ORDER BY created_on`,
    function (error, results){
      if(error){
        console.log('there is an error: ' + error);
        res.status(500)
      } else {
        res.json(results)
      }
    }
  )
};

const getAllPostsByCategory = () => {

}

const getAllPostsByGenre = () => {
  
};

const getAllPostsByInstrument = () => {
  
};

const newPost = (req, res) => {
  console.log('Inside the POST new post route');

  let user_id = req.body.user_id;
  let instrument_id = req.body.instrument_id;
  let genre_id = req.body.genre_id;
  let post_type = req.body.post_type;
  let post_title = req.body.post_title;
  let post_detail = req.body.post_detail;
  
  if(req.body){
    let sql = `INSERT into posts VALUES (post_id, ?, ?, ?, ?, current_timestamp(), ?, ?)`
    let body = [];

    body.push(user_id, instrument_id, genre_id, post_type, post_title, post_detail)
    console.log(`this is your current body: ` + body)

    instance.query(sql, body,function(error, results){
        if(error){
          console.log(`there is an error: ` + error);
          res.status(500)
        } else {
          res.json(results)
          console.log(results)
        }
      })
  }
}

const updatePost = (req, res) => {
  console.log('Inside the PUT update post route');
  let sql = `UPDATE posts SET
  instrument_id = ?,
  genre_id = ?,
  post_type = ?,
  created_on = current_timestamp(),
  post_title = ?,
  post_detail = ?
  WHERE post_id = ${req.params.id}`
  
  let body = [];
  body.push(req.body.instrument_id, req.body.genre_id, req.body.genre_id, req.body.post_type, req.body.post_title, req.body.post_detail);

  instance.query(sql, body, function(err){
    if(err){
      console.log(`there is an error: ` + error);
      res.status(500)
    } else {
      res.send(`Your Post has been updated: ` + body)
    }
  })

};

const deletePost = (req, res) => {
  console.log(`Inside the DELETE post by ID route`)
  let sql = `DELETE FROM posts WHERE post_id = ${req.params.id}`;
  
  instance.query(sql, function(err){
    if(err){
      console.log(`there is an error: ` + error);
      res.status(500)
    }
    res.send(`Succesfully deleted post by post_id: ${req.params.id}`)
  })
};
module.exports = {
  getAllPosts,
  getAllPostsByCategory,
  getAllPostsByInstrument,
  getAllPostsByGenre,

  newPost,
  updatePost,
  deletePost
}