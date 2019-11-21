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

module.exports = function(email, token) {
    transporter.sendMail({
        from: `IH Test <${EMAIL}>`,
        to: email,
        subject: 'Confirm Your Email',
        html: `
          <a href="http://localhost:3000/auth/confirm/${token}">Confirm Email</a>
        `
      })
      .then(response => {
          console.log(response);
      })
      .catch(error => {
          console.log(error); 
      });
}