"use strict";
const express = require("express");
const AWS = require("aws-sdk");
const fs = require("fs");
const axios = require('axios');

// Constants
const PORT = 8080;
const HOST = "54.160.41.61";

// App
const app = express();

// middleware
app.use(express.json());

app.get("/", async (req, res) => {
  axios.post('http://3.88.132.229/begin', {
    banner: "B00896717",
    ip: "54.160.41.61:8080"
  })
  .then(function (response) {
    console.log(response.data);
    res.send(response.data);
  })
  .catch(function (error) {
    console.log(error);
    res.send(error);
  });
})

app.post("/storedata", async (req, res) => {
  console.log(req.socket.remoteAddress + " " + req.method);
  console.log("file data = ", req.body.data);
  let data = req.body.data;

  //From aws docs [1].
  AWS.config.loadFromPath("./config.json");

  var s3 = new AWS.S3();

  //write data to file
  fs.writeFile("testFile.txt", data, function (err) {
    if (err) throw err;
  });

  var params = {
    Bucket: "assignment2-5409",
    Key: "test-file",
    Body: fs.createReadStream("./testFile.txt"),
  };

  // From aws docs [2].
  s3.upload(params, function (err, data) {
    if (err) {
      res.send({ error: err });
    }
    if (data) {
      res.status(200);
      res.send({ s3uri: data.Location });
    }
  });
});

app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}/`);
