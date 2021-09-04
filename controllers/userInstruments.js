const instance = require('../sql/connection');

const userInstruments = (req, res) => {
  console.log("Inside the GET /userIntruments route")
  const sql = `SELECT users.user_id, users.user_name, group_concat(DISTINCT instrument) AS instruments
               FROM users, instruments
               JOIN user_instruments
               ON user_instruments.instrument_id = instruments.instrument_id
               WHERE users.user_id = user_instruments.user_id
               GROUP BY users.user_id;`
  instance.query(sql, (error, results) => {
    if(error) {
      console.log("Failed to Fetch Users Instruments")
      res.status(500).send("Failed to Fetch Users Instruments")
    } else {
      let userInstruments = []
      for(i=0; i<results.length; i++) {
          let user={}
          user.user_id = results[i].user_id;
          user.user_name = results[i].user_name;
          user.instruments = results[i].instruments.split(',')
          userInstruments.push(user)  
      }
      res.json(userInstruments)
    }
  })
};

const userInstrumentId = (req, res) => {
  console.log("Inside the GET /userInstruments/:id route")
  const { id } = req.params
  const sql = `SELECT users.user_id, users.user_name, group_concat(DISTINCT instrument) AS instruments
               FROM users, instruments
               JOIN user_instruments
               ON user_instruments.instrument_id = instruments.instrument_id
               WHERE users.user_id = user_instruments.user_id
               AND users.user_id = ?
               GROUP BY users.user_id;`
  instance.query(sql, id, (error, results) => {
    if(error) {
      console.log("Failed to Fetch User Instrument by IDh")
      res.status(500).send("Failed to Fetch User Instrument by ID")
    } else {
      let userGenres = []
      for(i=0; i<results.length; i++) {
          let user={}
          user.user_id = results[i].user_id;
          user.user_name = results[i].user_name;
          user.genres = results[i].instruments.split(',')
          userGenres.push(user)  
      }
      res.json(userGenres)
    }
  })
};

const addUserInstrument = (req, res) => {
  console.log("Inside POST isntrument route")
  const sql = `INSERT INTO user_instruments VALUES (?, ?)`;
  const { id } = req
  const { instrument_id } = req.body
  instance.query(sql, [id, instrument_id], (err, results) => {
    if(err) {
      console.log("Failed to add Instrument")
      res.status(500).send("Failed to add Instrument")
    } else {
      res.json("Instrument Added")
    }    
  })
}

module.exports = {
  userInstruments,
  userInstrumentId,
  addUserInstrument
}