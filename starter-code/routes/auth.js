const nodemailer = require('nodemailer');
const {
  Router
} = require('express');

const router = new Router();

const User = require('../models/user');
const bcryptjs = require('bcryptjs');

router.get('/confirm/:confirmationCode', (req, res, next) => {
  const {
    confirmationCode
  } = req.params;

  User.findOne({
      confirmationCode
    })
    .then((user) => {
      if (user) {
        user.update()
      }
    })
});