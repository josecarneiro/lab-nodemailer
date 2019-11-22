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
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending Confirmation", "Active"],
    default: ["Pending Confirmation"]
  },
  confirmationCode: {
    type: String,
    trim: true,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;


//- **`email`** - the user will complete the signup form with the email they will use to confirm the account.