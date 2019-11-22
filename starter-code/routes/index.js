'use strict';

const { Router } = require('express');
const router = new Router();

router.get('/', (req, res, next) => {
  console.log(req.user);
  res.render('index', { title: 'Hello World!' });
});

router.get('/private', (req, res, next) => {
  res.render('private');
});

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

transporter.sendMail({
  from: `IH Test <${EMAIL}>`,
  to: EMAIL,
  subject: 'Test email',
  html: `
    <style>
      h1 {
        /* color: green !important; */
      }
    </style>
    <h1 style="color: green">This is an email. Click the link: http://localhost:3000/auth/confirm/THE-CONFIRMATION-CODE-OF-THE-USER </h1>
    <p><strong>Hello</strong> <em>World!</em></p>
  `
})
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });


 

module.exports = router;
