const { Router } = require('express');
const router = new Router();

const User = require('./../models/user');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

const generateId = email => {
  const characters = 
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < email.length; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};

router.post('/sign-up', (req, res, next) => {
  const { name, email, password } = req.body;
  const token = generateId(email);
  bcryptjs
    .hash(password, 10)
    .then(hash => {
      return User.create({
        name,
        email,
        passwordHash: hash,
        confirmationCode: token
      });
    })
    .then(user => {
      req.session.user = user._id;
      res.redirect('/');
      // NODEMAILER:
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      transporter.sendMail({
        from: `IH Test <${process.env.EMAIL_USER}>`,
        to: `notov23430@xmail2.net`, 
        subject: 'Confirmation Email', 
        html: `
        <style>
          h1 {
            /* color: green !important; */
          }
        </style>
        <p>http://localhost:3000/auth/confirm/${token}</p>
      `
    })
    })
    .catch(error => {
      next(error);
    });
});

router.get("/auth/confirm/:confirmCode", (req, res, next) => {
  let confirmer = req.params.confirmCode;
  User.findOneAndUpdate(
    { confirmationCode: confirmer },
    { status: "Active" })
  .then(user => {res.render('confirmation.hbs'),
  console.log("page was found")})
  .catch(error => {
    next(error);
  });
});

// use promise and pass user to use it in the hbs file
router.get('/profile', (req, res, next) => {
  User.findById(req.session.user)
  .then(user => {
    res.render('profile.hbs', {user}
    )
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
