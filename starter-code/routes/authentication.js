const { Router } = require('express');
const router = new Router();
const nodemailer = require('nodemailer');

const User = require('./../models/user');
const bcryptjs = require('bcryptjs');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

router.post('/sign-up', (req, res, next) => {
  const { name, email, password } = req.body;
  let token = '';

  const generateId = length => {
    const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < length; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
  };
  }
  generateId(12)
  bcryptjs
    .hash(password, 10)
    .then(hash => {
      return User.create({
        name,
        email,
        passwordHash: hash,
        confirmationCode : token
      });
    })
    .then(user => {
      req.session.user = user._id;
      console.log(req.session.user.email)
      res.redirect('/');
    })
    .then(
      transporter.sendMail({
        from: `IH Test <${process.env.EMAIL}>`,
        to: req.body.email,
        subject: 'This is boring...',
        //text: `http://localhost:3000/auth/confirm/${token}`,
        html: `
          <style>
            h1 {
              /* color: green !important; */
            }
          </style>
          <h1 style="color: green">I'm offff</h1>
          <a href ="http://localhost:3000/auth/confirm/${token}">Click here</a>
          <p><strong>Goodbye</strong> <em>Ironcats!</em></p>
        `
      }))
    .catch(error => {
      next(error);
    });
});

router.get('/auth/confirm/:code', (req, res, next) => {
  const code = req.params.code;
  User.findOneAndUpdate({confirmationCode : code}, {status: "Active"})
    .then(user => {
        res.render('confirmed', { user });
      })
    .catch(error => {
      next(error);
    });
});

router.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

router.post('/sign-in', (req, res, next) => {
  let userId;
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return Promise.reject(new Error("There's no user with that email."));
      } else {
        userId = user._id;
        return bcryptjs.compare(password, user.passwordHash);
      }
    })
    .then(result => {
      if (result) {
        req.session.user = userId;
        res.redirect('/');
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch(error => {
      next(error);
    });
});

router.post('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

const routeGuard = require('./../middleware/route-guard');

router.get('/private', routeGuard, (req, res, next) => {
  res.render('private');
});

module.exports = router;
