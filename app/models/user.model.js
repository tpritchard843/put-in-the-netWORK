const mongoose = require("mongoose");
const { v4: uuidv4 }= require('uuid');

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    uuid: String
  })
);

module.exports = User;
