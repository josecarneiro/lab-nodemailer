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
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  confirmationCode: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending Confirmation", "Active"],
    default: "Pending Confirmation"
  },
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;