"use strict";
const express = require("express");
const lodash = require("lodash");
const mysql = require("mysql");

// Constants
const PORT = 8080;
const HOST = "3.232.57.72";

// App
const app = express();

// middleware
app.use(express.json());

//Retrieve secret from AWS Secrets Manager - From AWS docs[1].
var AWS = require("aws-sdk"),
  region = "us-east-1",
  secretName = "assignmentDB",
  secret;

AWS.config.loadFromPath("./config.json");

var client = new AWS.SecretsManager({
  region: region,
});

var connection;

//Retrieve secret from AWS Secrets Manager using promise - From StackOverflow[2].
var secretResponse = client.getSecretValue({ SecretId: secretName }).promise();
secretResponse
  .then((data) => {
    if ("SecretString" in data) {
      secret = data.SecretString;
      secret = JSON.parse(secret);
    }

    //MySQL operations - From medium[3].
    connection = mysql.createConnection({
      host: secret.host,
      user: secret.username,
      password: secret.password,
      database: secret.dbname,
    });

    //MySQL operations - From medium[3].
    connection.connect((err) => {
      if (err) console.log("DB connection failed " + JSON.stringify(err));
      else console.log("DB connection successful");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/liststudents", async (req, res) => {
  //Creating HTML response - StackOverflow [4]
  let response = `<!DOCTYPE html>
  <html>
    <head>
      <style>
        table,
        th,
        td {
          border: 0.5px solid #888;
        }
      </style>
    </head>
    <body>
      <h1>Assignment 3 - Student List</h1>
  
      <table>
        <thead>
          <tr>
            <th>first name</th>
            <th>last name</th>
            <th>banner</th>
          </tr>`;

  //MySQL operations - From medium[3].
  connection.query("select * from students;", (err, data) => {
    if (err) {
      console.log(JSON.stringify(err));
      res.status(400);
      res.send("Something went wrong");
    } else {
      for (var i = 0; i < data.length; i++) {
        response += `<tr>
          <td>${data[i].first_name}</td>
          <td>${data[i].last_name}</td>
          <td>${data[i].banner}</td>
        </tr>`;
      }
      response += `</thead>
          <tbody></tbody>
          </table>
        </body>
      </html>`;

      res.send(response);
    }
  });
});

app.post("/storestudents", async (req, res) => {
  let students = req.body.students;

  if (lodash.isArray(students) && students.length > 0) {
    for (var i = 0; i < students.length; i++) {
      //MySQL operations - From medium[3].
      connection.query(
        `insert into students (first_name, last_name, banner) values ('${students[i].first_name}','${students[i].last_name}','${students[i].banner}');`,
        (err, data) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }

    res.status(200);
    res.send({ message: `${students.length} records inserted successfully` });
  } else {
    res.status(500);
    res.send({ message: "Invalid request" });
  }
});

app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}/`);

//VPC creation - From AWS docs[5].

//Connecting to AWS RDS - From AWS docs[6].
