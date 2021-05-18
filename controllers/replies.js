const instance = require('../sql/connection');

const getAllReplies = (req, res) => {
  console.log('Inside my GET all replies route');
  instance.query(`Select * FROM replies`, (error, results) => {
    if(error){
      console.log('there is an error: ' + error);
      res.status(500)
    } else{
      res.json(results)
      console.log(results)
    }
  })
}

const getReply= (req, res) => {

};

const getAllRepliesByUser= (req, res) => {

};

const getAllRepliesByPost= (req, res) => {

};

const newReply= (req, res) => {
  console.log('Inside my POST new Reply route');
  let sql = `INSERT INTO replies VALUES (reply_id, ?, ?, current_timestamp(), ?, ?)`
  let body = [req.body.post_id, req.body.user_id, req.body.reply_title, req.body.reply_detail]
  // body.push(req.body.post_id, req.body.user_id, req.body.reply_title, req.body.reply_detail);
  instance.query(sql, body, (error) => {
    if(error){
      console.log(`there is an error: ` + error);
      res.status(500)
    } else{
      res.send(`You have sent a New Reply: ` + body)
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

    let body = [req.body.post_title, req.body.post_detail, id];

    instance.query(sql, body, (error, results)=>{
      if(error){
        console.log(`there is an error: ` + error);
        res.status(500)
      }else{
        console.log(`inside query "updateReply"`)
        res.send(`Your Reply has been updated: ` + body) 
        console.log(results)
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
              res.status(500)
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
  getReply,
  getAllRepliesByUser,
  getAllRepliesByPost,
  
  newReply,
  updateReply,
  deleteReply
}