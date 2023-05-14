const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);