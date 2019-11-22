const mongoose = require('mongoose');




const generateId = length => {
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
};

const userSchema = new mongoose.Schema(
  {
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
    status:{
      type:String,
      enum: ["Pending Confirmation","Active"],
      default: "Pending Confirmation"
        },
    confirmationCode: {
        type: String,
        default: token,
        unique: true

    }
    },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
