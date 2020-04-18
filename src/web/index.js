const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();
const app = express();
const port = 3000;

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
