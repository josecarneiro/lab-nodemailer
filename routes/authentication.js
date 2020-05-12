const { Router } = require('express');
const router = new Router();

const User = require('./../models/user');
const bcryptjs = require('bcryptjs');

//NODEMAILER CONFIGURATION------------------------------
const dotenv = require('dotenv');
dotenv.config();

const nodemailer = require('nodemailer');
//--------------------------------------------------------

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

router.post('/sign-up', (req, res, next) => {
  const { name, email, password } = req.body;

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 20; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

  bcryptjs
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        name,
        email,
        passwordHash: hash,
        confirmationCode: token
      });
    })
    .then((user) => {
      req.session.user = user._id;

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_PASSWORD
        }
      });
      console.log(email);
      console.log(user.confirmationCode);
      console.log(`http://localhost:3000/auth/confirm/${user.confirmationCode}`);

      transporter
        .sendMail({
          from: `test <${process.env.NODEMAILER_EMAIL}>`,
          to: email,
          subject: 'Confirmation email',
          //text: 'test'
          html: `<p><a href="http://localhost:3000/auth/confirm/${user.confirmationCode}">Confirm</a></p>`
        })
        .then((response) => {
          console.log(response);
          req.session.user = user._id;
          res.redirect('/');
        })
        .catch((error) => {
          next(error);
        });
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/confirm/:confirmCode', (req, res, next) => {
  let confirm = req.params.confirmCode;
  const filter = { confirmationCode: `${confirm}` };
  const update = { status: `Active` };

  console.log(confirm);
  return User.findOneAndUpdate(filter, update)
    .then((document) => {
      res.render('confirm');
    })
    .catch((error) => {
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
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("There's no user with that email."));
      } else {
        userId = user._id;
        return bcryptjs.compare(password, user.passwordHash);
      }
    })
    .then((result) => {
      if (result) {
        req.session.user = userId;
        res.redirect('/');
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch((error) => {
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
