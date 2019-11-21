'use strict';
const nodemailer = require('nodemailer');
require('dotenv').config();

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.MAIL, // generated ethereal user
      pass: process.env.MAIL_PW // generated ethereal password
    }
  });
}

function sendConfirmation(user) {
  transporter.sendMail({
    from: '"Fred Foo 👻" <process.env.MAIL>', // sender address
    to: `${user.email}`, // list of receivers
    subject: 'Hello ✔', // Subject line

    html: `<b>Hello world?</b>
    please confirm your email clicking <a href="http://localhost:3000/auth/confirm-email/${user.confirmationCode}` // html body
  });
}

main().catch(console.error);

module.exports = sendConfirmation;
