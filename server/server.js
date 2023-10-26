// server.js    Isaiah Campsall   Oct.12, 2023

// this is a server that provides interaction with a database in concert with the queries.js file


const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const db = require('./queries.js');

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));

//allow requests from localhost port 5500
app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  next();
});
app.use(express.urlencoded({ extended: true }));

app.use('/envelopes/:envelopeId', db.verifyEnvelopeId);

app.get("/envelopes", db.getEnvelopes);

app.get("/envelopes/:envelopeId", db.getEnvelopeById);

app.post('/envelopes', db.postNewEnvelope);


//delete envelope by envelopeId is working
app.delete('/envelopes/:envelopeId', db.deleteEnvelopeById);

app.listen(3000, () => console.log("listening on port 3000"));