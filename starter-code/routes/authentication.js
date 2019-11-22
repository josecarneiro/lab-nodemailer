const { Router } = require('express');
const router = new Router();

const User = require('./../models/user');
const bcryptjs = require('bcryptjs');

const nodemailer = require('nodemailer');
const EMAIL = 'ih174test@gmail.com';
const PASSWORD = 'IH174@lis';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: EMAIL,
    pass: PASSWORD
  }
});

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

let token = ""; 

router.post('/sign-up', (req, res, next) => {
const { name, email, password } = req.body;

const generateId = length => {
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < length; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
};
  generateId(10); 
  bcryptjs
    .hash(password, 10)
    .then(hash => {
      return User.create({
        name,
        email,
        confirmationCode: token,
        passwordHash: hash
      });
    })
    .then(user => {
      req.session.user = user._id;
      transporter.sendMail({
    from: `testttt <${EMAIL}>`,
    to: user.email,
    subject: 'Lissy Test email',
  // text: 'This should be the body of the text email'
    html: `
    <style>
      h1 {
        /* color: green !important; */
      }
    </style>
    <h1 style="color: green">This is the email that you need to click to verify: http://localhost:3000/confirm/${token}</h1>
    <p><strong>Hello</strong> <em>World!</em></p>
  `
})
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });
      res.redirect('/');
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

router.get('/confirm/:confirmationCode', (req, res, next) => {
  console.log(req.params)
  const confirmationCode = req.params.confirmationCode
        console.log(confirmationCode)

 User.findOne({ confirmationCode })
    .then(user => {
      console.log(user)
      if (!user) {
        return Promise.reject(new Error("That's the wrong code"));
      } else {
        status = "Active"
        return status;
      }
    })
    .then(result => {
        res.redirect('/confirmation');
    })
    .catch(error => {
      next(error);
    });
});


module.exports = router;
