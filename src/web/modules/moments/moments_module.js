// Import dependencies


// Import mongoose model
const Moment = require("../../models/moment.js");

// Export public methods
module.exports = {
    //// List of methods, comma separated. Should be CRUD operations
    // CREATE
    Create: (from, text, callback) => {
        var data = {
            from: from,
            date: Date.now(),
            text: text
        };
        var result;
        Moment.create(data, (err, newEntry) => {
            if (!err) {
                result = {
                    ok: true,
                    object: newEntry
                }
            } else {
                result = {
                    ok: false,
                    error: err
                }
            }
        });
        setTimeout(() => {
            callback(result);
        }, 500);
    },
    // READ
    GetAll: (callback) => {
        var result;
        Moment.find({}, (err, allMoments) => {
            if (!err) {
                result = {
                    ok: true,
                    object: allMoments
                }
            } else {
                result = {
                    ok: false,
                    error: err
                }
            }
        });
        setTimeout(() => {
            callback(result);
        }, 500);
    },
    // UPDATE
    // DELETE
    Clear: (params,callback) => {
        var result;
        Moment.deleteMany(params, (err) => {
            if (!err) {
                result = {
                    ok: true
                }
            } else {
                result = {
                    ok: false
                }
            }
        });
        setTimeout(() => {
            callback(result);
        }, 500);
    }
}

// Private methods
