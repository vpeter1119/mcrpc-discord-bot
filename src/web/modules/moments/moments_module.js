// Import dependencies


// Import mongoose model
const Moment = require("../../models/moment.js");

// Export public methods
module.exports = {
    //// List of methods, comma separated. Should be CRUD operations
    // READ
    GetAll: () => {
        Moment.find({}, (err, res) => {
            console.log(res);
        });
        return ("OK.");
    },
    // CREATE
    Create: (input) => {
        var data = {
            from: "Nemo",
            date: Date.now(),
            text: input
        };
        Moment.create(data, (err, res) => {
            if (!err) {
                console.log(res);
            } else {
                //Handle errors
                console.log(err);
            }
        });
    },
}

// Private methods
