const Pool = require("pg").Pool;
require('dotenv').config();

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
})


const getEnvelopeById = (req, res) => {
    const id = req.id;
    pool.query('SELECT * FROM envelopes WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows);
    })
}
const getEnvelopes = (req, res) => {
    pool.query('SELECT * FROM envelopes ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows);
    })
}

const postNewEnvelope = (req, res) => {
  const {name, balance} = req.body;

  pool.query(`INSERT INTO envelopes (name, balance) VALUES ($1, $2)`, [name, balance], (error, results) => {
    if (error){
      throw error
    }
    res.status(201).send("successfully posted new envelope");
  })
}

const deleteEnvelopeById = (req, res) => {
  const id = req.id;
  pool.query('DELETE FROM envelopes WHERE id = $1', [id], (error, results) => {
    if (error){
      throw error
    }
    res.status(200).send(`successfully deleted envelope with id: ${id}`);
  })
  
}


//verify id is used for all routes that match envelope/:id 
const verifyEnvelopeId = (req, res, next) => {
  //set id = the numerical representation of the :envelopeId parameter
  const id = parseInt(req.params.envelopeId);
  //query the envelopes table for the specified id
  pool.query('SELECT * FROM envelopes WHERE id = $1', [id], (error, results) => {
    if (error){
      throw error
    }
    if(results.rowCount === 0){
      //if id does not exist in specified table, 404 not found
      res.status(404).send(`element with ID of ${id} does not exist in envelopes table`)
    } else{
      //if it does exist, assign id to req.id and move to the next function
      req.id = id;
      next();
    }
  })
}

module.exports = {
    getEnvelopeById,
    getEnvelopes,
    postNewEnvelope,
    deleteEnvelopeById,
    verifyEnvelopeId
}
