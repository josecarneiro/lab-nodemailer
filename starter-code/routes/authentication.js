const { Router } = require("express");
const router = new Router();

const User = require("./../models/user");
const nodemailer = require("nodemailer");
// const sendEmail = require("../mail");
const bcryptjs = require("bcryptjs");

const generateToken = length => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  // console.log(token);
  return token;
};

const EMAIL = "ih174test@gmail.com";
const PASSWORD = "IH174@lis";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD
  }
});

function sendMail(user) {
  transporter.sendMail({
        from: `IH Test <EMAIL>`,
        to: EMAIL, //`${user.email}`,
        subject: "WORK WORK WORK",
        html: `
        <h1>PLEASE WORK</h1></h1>
        please confirm your email 
        <a href="http://localhost:3000/auth/confirm-email/${user.confirmationCode}">here</a>
      `
      })
}



router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/sign-up", (req, res, next) => {
  res.render("sign-up");
});

router.post("/sign-up", (req, res, next) => {
  // console.log(req.body);
  const { username, email, password  } = req.body;
  let newConfirmationCode = generateToken(12);
  // console.log(newConfirmationCode);
  bcryptjs
    .hash(password, 10)
    .then(hash => {
      return User.create({
        username,
        email,
        passwordHash: hash,
        confirmationCode: newConfirmationCode
      });
    })
    .then(user => {
      sendMail(user);
      req.session.user = user._id;
      res.redirect("/");
    })
    .catch(error => {
      next(error);
    });
});

router.get('/auth/confirm-email/:mailToken', (req, res, next) => {
  const mailToken = req.params.mailToken;
  User.findOneAndUpdate({ confirmationCode: mailToken }, { status: 'Active' })
    .then(user => {
      console.log('USEEER', user);
      req.session.user = user._id;
      res.redirect('/confirmation-page');
    })
    .catch(err => next(err));
});

router.get("/sign-in", (req, res, next) => {
  res.render("sign-in");
});

router.post("/sign-in", (req, res, next) => {
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
        res.redirect("/");
      } else {
        return Promise.reject(new Error("Wrong password."));
      }
    })
    .catch(error => {
      next(error);
    });
});

router.post("/sign-out", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/confirmation-page", (req, res, next) => {
  console.log("USER",req.session.user);
  res.render("confirmation");
});

router.get("/profile", (req, res, next) => {
  res.render("profile");
});

const routeGuard = require("./../middleware/route-guard");

router.get("/private", routeGuard, (req, res, next) => {
  res.render("private");
});

module.exports = router;
