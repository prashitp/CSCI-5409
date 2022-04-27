'use strict';
import express from 'express';
import { readFileSync } from 'fs';

// Constants
const PORT = 8081;
const HOST = '0.0.0.0';

// App
const app = express();

// middleware
app.use(express.json());

app.post('/', async(req, res) => {
  const word = req.body.word;

  let arr = readFileSync('/app/dictionary.txt').toString().split("\n");

  var obj = {};
  var wordFound = false;
  arr.forEach(element => {
    let wordArr = element.split("=");
    if(wordArr[0] === word) {
        wordFound = true;
        obj.definition = wordArr[1];
        res.send(obj);
    }
  });

  if(!wordFound) {
    res.send({
        "error": "Word not found in dictionary."
    });
  }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);