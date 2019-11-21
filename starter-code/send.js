const nodemailer = require('nodemailer');

const EMAIL = 'ih174test@gmail.com';
const PASSWORD = '123456789';

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
    <h1 style="color: green">This should be the body of the text email</h1>
    <p><strong>Hello</strong> <em>World!</em></p>
  `
})
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });

  module.export = transporter;