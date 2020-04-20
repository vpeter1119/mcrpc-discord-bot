
// Require npm packages
const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Set up database connection
const mongoose = require("mongoose");
const mongoPw = process.env.MONGODB_PW;
const mongoUser = process.env.MONGODB_USER;
const mongoUrl = process.env.MONGODB_URL;
mongoose.connect(
    "mongodb+srv://" +
    mongoUser +
    ":" +
    mongoPw +
    mongoUrl,
    { useNewUrlParser: true, useUnifiedTopology: true },
    err => {
        if (!err) {
            console.log("Connected to database.");
        } else {
            console.log(err);
            console.log("Did not connect to database.");
        }
    }
);


app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    next();
});

app.get("/", (req, res) => {
    res.send("If you see this, the server is running. Cheers!");
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));

exports.web = app;
