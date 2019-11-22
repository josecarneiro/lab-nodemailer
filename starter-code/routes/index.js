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

// router.post('/send-email', (req, res, next) => {
//   let { email, subject, message } = req.body;
//   res.render('message', { email, subject, message })
// });

module.exports = router;
