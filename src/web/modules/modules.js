//// This file should import all the modules from the subfolders and export them as a package

// Import modules
const momentsModule = require("./moments/moments_module.js");

const modules = {
    //Add every module here
    momentsModule
};

module.exports = modules;