const instance = require('../sql/connection');

const addUserInstrument = (req, res) => {
  console.log("Inside POST isntrument route")
  const sql = `INSERT INTO user_instruments VALUES (?, ?)`;
  const { user_id, instrument_id } = req.body
  instance.query(sql, [user_id, instrument_id], (err, results) => {
    if(err) {
      console.log("Failed to add Instrument")
      res.status(500).send("Failed to add Instrument")
    } else {
      res.json("Instrument Added")
    }    
  })
}

module.exports = {
  addUserInstrument
}