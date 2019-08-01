const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const productDetail = new Schema({

    product_name: { 
      type: String,
      required: true,
    },

    rate: {
      type: Number,
      required: true,
    },

    user: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },
    
    date: {
     type: Date,
     default: new Date()
    }

});

module.exports = product = mongoose.model("productdetails", productDetail);