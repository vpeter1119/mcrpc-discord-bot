require('dotenv').config();

let config = require("./config.json");

// Overwrite some data
//// token value should never be included in code
//// prefix is different for development and production environments
config.token = process.env.TOKEN;
config.prefix = process.env.PREFIX || config.prefix; //this should default to the character in config.json
config.production = process.env.PRODUCTION == "FALSE" ? false : true;

// This function returns the content of the config object, to be exported
function ReturnConfig() {
    return config;
}

module.exports = ReturnConfig();