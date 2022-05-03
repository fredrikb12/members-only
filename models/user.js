const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, minlength: 3, maxlength: 30 },
  last_name: { type: String, required: true, minlength: 3, maxlength: 30 },
  username: { type: String, required: true, minlength: 5 },
  password: { type: String, required: true, minlength: 5 },
});

module.exports = mongoose.model("User", UserSchema);
