const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    validate: { validator: isEmail, message: 'Email is not valid.' },
    minlength: 2,
    maxlength: 30,
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);