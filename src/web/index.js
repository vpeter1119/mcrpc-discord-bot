// Require npm packages
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const debug = process.env.PRODUCTION === "FALSE";
const app = express();
const port = process.env.PORT || 3000;

// Set up database connection
const mongoose = require("mongoose");
const mongoUri = process.env.MONGODB_URI;
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect(mongoUri, mongoOptions, err => {
  if (!err) {
    if (debug) console.log("Connected to database.");
  } else {
    console.log(err);
    console.log("Did not connect to database.");
  }
});

// TODO: add comment to this app.use part. Why are there three app.use lines? What is bodyParser?
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

// TODO: add comment, what is next? - the rest seems self-explanatory (although the Authorization part might need clarification)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  next();
});

// TODO: is this command needed? How about adding the if(debug) here?
app.get("/", (req, res) => {
  res.send("If you see this, the server is running. Cheers!");
});

app.listen(port, () => {
  if (debug) console.log(`Server listening on port ${port}!`);
});

exports.web = app;
