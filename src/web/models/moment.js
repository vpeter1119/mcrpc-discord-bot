const mongoose = require("mongoose");

const options = {
    //Insert any schema options here
}

const momentSchema = mongoose.Schema({
  from: { type: String },
  date: { type: Date },
  text: { type: String, required: true }
}, options);

const Moment = mongoose.model("Moment", momentSchema);

module.exports = Moment;