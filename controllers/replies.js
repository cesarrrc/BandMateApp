const instance = require('../sql/connection');

const getAllReplies = (req, res) => {
  console.log('Inside my GET all replies route');
  instance.query(`Select * FROM replies`, (error, results) => {
    if(error){
      console.log('there is an error: ' + error);
      res.status(500)
    } else{
      res.json(results)
    }
  })
}

const userReplies = (req, res) => {
  console.log('Inside my /GET user Replies');
  instance.query(
    `SELECT replies.reply_id,
     replies.post_id,
     replies.user_id,
     users.user_name,
     replies.reply_title,
     replies.reply_detail,
     replies.created_
     FROM replies
     JOIN users
     ON users.user_id = replies.user_id
     ORDER BY reply_id
     `,
     function(error, results) {
      if(error){
        console.log('there is an error: ' + error);
        res.status(500)
      } else {
        res.json(results)
      }
     }
  )
};

const userRepliesId = (req, res) => {
  console.log('Inside my /GET user Replies by Id');
  let { id } = req.params
  let sql = `SELECT replies.reply_id,
             replies.post_id,
             replies.user_id,
             users.user_name,
             replies.reply_title,
             replies.reply_detail,
             replies.created_
             FROM replies
             JOIN users
             ON users.user_id = replies.reply_id
             WHERE users.user_id = ?
             ORDER BY reply_id`
  instance.query(sql, id, (error, results) => {
    if(error){
      console.log('there is an error: ' + error);
      res.status(500)
    } else {
      res.json(results)
    }
  })
};

const myReplies = (req, res) => {
  console.log('Inside my /GET MyReplies by ID route')
  let id = req.id
  let sql = `SELECT post_id, GROUP_CONCAT(DISTINCT reply_id) AS replies, GROUP_CONCAT(DISTINCT user_id) AS user_id
            FROM replies
            WHERE user_id = ?
            GROUP BY post_id `
  instance.query(sql, id, (error, results) => {
    if (error){
      console.log("There is an error" +  error);
      res.status(500).send({message: "There is an internal error"});
    } else {
      res.json(results)
    }
  })
}

const newReply= (req, res) => {
  console.log('Inside my POST new Reply route');
  let sql = `INSERT INTO replies VALUES (reply_id, ?, ?, current_timestamp(), ?, ?)`
  let {post_id, reply_title, reply_detail} = req.body
  let user_id = req.id
  let body = [post_id, user_id, reply_title, reply_detail]
  // body.push(req.body.post_id, req.body.user_id, req.body.reply_title, req.body.reply_detail);
  instance.query(sql, body, (error) => {
    if(error){
      console.log(`there is an error: ` + error);
      res.status(500).send(error)
    } else{
      res.json(`You have sent a New Reply`)
      console.log(body)
    }
  })
};

const updateReply= (req, res) => {
  console.log('Inside the PUT update Reply Route');
  let sql = `UPDATE replies SET
    created_ = current_timestamp(),
    reply_title = ?,
    reply_detail = ?
    WHERE reply_id = ?`

    let id = req.params.id;

    let body = [req.body.reply_title, req.body.reply_detail, id];

    instance.query(sql, body, (error, results)=>{
      if(error){
        console.log(`there is an error: ` + error);
        res.status(500)
      }else{
        res.send(`Your Reply has been updated`) 
      }
    })
};

const deleteReply= (req, res) => {
  console.log(`Inside the DELETE Reply by ID route`)
  const id = req.params.id;
  const getAllRows = `SELECT * FROM replies`
  instance.query(getAllRows, (error, results)=>{
    if(error){
      console.log(`there is an error: ` + error);
      res.status(500)
    }else{
      // console.log(results)
      for(i=0; i<results.length; i++){
        console.log(results[i].reply_id)
        if(results[i].reply_id == id){
          let deleteReply = `DELETE FROM replies WHERE reply_id = ?`
          instance.query(deleteReply, id, (error)=>{
            if(error){ 
              console.log(`there is an error: ` + error);
              res.status(500).send(error)
            }
            res.send(`Succesfully deleted Reply by reply_id of: ${id}`)
          });
        }
      }
    }
  })
   
};

module.exports = {
  getAllReplies,
  userReplies,
  userRepliesId,
  myReplies,
  newReply,
  updateReply,
  deleteReply
}