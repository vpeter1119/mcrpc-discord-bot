//// This file should import all the modules from the subfolders and export them as a package

// Import modules
const moments = require("./moments/moments_module.js");

const modules = {
    //Add every module here
    moments
};

module.exports = modules;