const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const table = ['list', 'of', 'words', '00l', 'and', 'things']; 


app.use(morgan('dev'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  next();
});

app.get("/:id", (req, res, next) => {
    const id = req.params.id;
    if (id){
        res.send(table);
    } else{
        res.status(404).send("not found");
    }
});

app.listen(3000, () => console.log("listening on port 3000"));