// require express, dotenv and sqlite3
const express = require('express');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3');

// start express app
const app = express();
//run server at port 3000
const port = process.env.PORT || 3000;

// set up database
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// set up dotenv
dotenv.config();

// set up middleware
app.use(express.json());

// set up routes
app.get('/', (req, res) => {
  res.send('Hello World');
});

// start express server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

