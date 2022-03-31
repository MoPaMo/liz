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
  // send index.html
    res.sendFile(__dirname + "/index.html");
});
// handle get requests to api/entries
app.get("/api/entries", (req, res) => {
  //set limit to 15 if not set by query
  const limit = req.query.limit ? req.query.limit : 15;
  // get limited entries from table "entries"
  db.all(
    `SELECT * FROM entries ORDER BY date DESC LIMIT?`,
    [limit],
    (err, rows) => {
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
    }
  );
});
// handle get requests for specific items
app.get("/api/entries/:id", (req, res) => {
  // get specific entry from table "entries"
  db.get(`SELECT * FROM entries WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).send({ error: "database failure" });
      // log error to console
      console.error(err);
    } else if (row) {
      res.json({
        message: "success",
        entries: row,
      });
    } else {
      res.status(404).send({ error: "no such entry" });
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
