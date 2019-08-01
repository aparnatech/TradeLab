const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const loginDetailSchema = new Schema({

  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  
  date: {
    type: String,
    
  }

});
module.exports = LoginData = mongoose.model("loginData", loginDetailSchema);