// require express, dotenv and sqlite3
const express = require("express");
const dotenv = require("dotenv");
const sqlite3 = require("sqlite3");

// start express app
const app = express();
//run server at port 3000
const port = process.env.PORT || 3000;

// set up database
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);
// create new table "entries" with values date int, topic text, code text, header text, notice text if not existing
db.run(
  "CREATE TABLE IF NOT EXISTS entries (date INTEGER, topic TEXT, code TEXT, header TEXT, notice TEXT)"
);
// set up dotenv
dotenv.config();

// write message to console if the password is blank
if (process.env.PASSWORD === "") {
  console.log(
    "WARNING: The password is blank. Unless you change it in a .env file, noone will be able to post or delete notes on your site."
  );
}

// set up middleware
app.use(express.json());
//use /cdn for static files
app.use(express.static("cdn"));
// set up routes
app.get("/", (req, res) => {
  res.send("Hello World");
});
// handle get requests to api/entries
app.get("/api/entries", (req, res) => {
  // get all entries from table "entries"
  db.all("SELECT * FROM entries", (err, rows) => {
    if (err) {
      res.status(500).send({ error: "database failure" });
      // log error to console
      console.error(err);
    } else {
      res.json({
        message: "success",
        entries: rows,
      });
    }
  });
});
// handle post requests to api/entries
app.post("/api/entries", (req, res) => {
  // get data from request body
  const { topic, code, header, notice, pwd } = req.body;
  // check if all data is present
  if (!topic || !code || !header || !notice || !pwd) {
    return res.status(400).json({
      error: "bad request",
    });
  }
  // check if password is correct
  if (pwd !== process.env.PASSWORD) {
    return res.status(401).json({
      error: "unauthorized",
    });
  }
  // set date to unix timestamp
  const date = Date.now();
  const sql = `INSERT INTO entries (date, topic, code, header, notice) VALUES (?,?,?,?,?)`;
  // insert data into table "entries"
  db.run(sql, [date, topic, code, header, notice], function (err) {
    if (err) {
        //log error to console
        console.error(err);
      res.status(500).json({
        error: "database failure",
      });
    } else {
      res.status(201).json({
        message: "created",
        id: this.lastID,
      });
    }
  });
});

// start express server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
