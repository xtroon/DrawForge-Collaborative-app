const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  // We can track the boards this user is a part of
  boards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board'
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
