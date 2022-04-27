'use strict';
import fetch from 'node-fetch';
import express from 'express';

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

// middleware
app.use(express.json());

// Validate input
const validateInput = (word) => {
    if(word === null || word === "") {
        return false;
    }
    return true;
}

app.post('/definition', async(req, res) => {
  let word = req.body.word;
  
  const validated = validateInput(word);
  if(!validated) {
      res.send({
        "word": word,
        "error": "Invalid JSON input."
    })
  } else {
    let processedWord = word.trim().toLowerCase();
    const response = await fetch('http://processor:8081', {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
            word: processedWord
        })
    })
    const body = await response.json();
    
    res.send({
      word: word,
      ...body
    });
  }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);