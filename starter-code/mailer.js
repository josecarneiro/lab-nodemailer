function mailer(userEmail, token) {
  const nodemailer = require("nodemailer");

  const EMAIL = "ih174test@gmail.com";
  const PASSWORD = "IH174@lis";
  const mytoken = token;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD
    }
  });

  transporter
    .sendMail({
      from: `IH Test <${EMAIL}>`,
      to: userEmail,
      subject: "Confirmation",
      text: mytoken
    })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
}

module.exports = mailer;
