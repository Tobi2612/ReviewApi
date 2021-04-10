const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs")
// const salt=10;
// const jwt=require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  reviews:[{
    type: mongoose.Schema.Types.ObjectId , ref:'review'
  }]
});

module.exports = mongoose.model("user", userSchema);