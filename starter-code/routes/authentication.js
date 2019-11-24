const { Router } = require("express");
const router = new Router();

const User = require("./../models/user");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/sign-up", (req, res, next) => {
  res.render("sign-up");
});

router.post("/sign-up", (req, res, next) => {
  let token = "";
  const generateId = length => {
    const characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < length; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }
  };

  generateId(10);
  //console.log(generateId());
  const { name, email, password } = req.body;
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
      res.redirect("/");
    })
    .then(user => {
      console.log("trasporter below");
      transporter.sendMail({
        from: `"IH Test" <${process.env.EMAIL}>`,
        to: process.env.EMAIL,
        subject: "Test- confirmation email",
        html: `
        <div align='center'>
        <img src="https://user-images.githubusercontent.com/23629340/40541063-a07a0a8a-601a-11e8-91b5-2f13e4e6b441.png" alt="Ironhack logo">
        <br>
        <br>
        <big>Ironhack Confirmation Email</big>
        <br>
        <br>
        <strong>hello</strong>
        <br>
        <p>Thanks for joining our community! Please confirm your account by clicking on the link:</p>
        <strong><a href="http://localhost:3000/auth/confirm/${token}">Link</a></strong>
        <br>
        <br>        
        <strong>Great to see you creating awesome webpages with us! &#x1F60E;</strong>
        <br>
        <br>
        <br>
        <small>You are doing awesome! 💙</small>
        </div>
          
        `
      });
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
  });
  
  router.get("/auth/confirm/:token", (req, res, next) => {
  const token = req.params.token;
  console.log("TOKEN", token)
  User.findOneAndUpdate({confirmationCode: token}, 
    { 
      status: 'Active'
    })
    .then(user => {
      console.log("USER", user)
      req.session.user = user._id;
      res.redirect("/confirmation");
    })
    .catch(err => {
      next(err)
    });
  });
  
  router.get("/confirmation", (req, res, next) => {
    res.render("confirmation");
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

const routeGuard = require("./../middleware/route-guard");

router.get("/private", routeGuard, (req, res, next) => {
  res.render("private");
});

router.get('/profile', (req, res, next) => {
  res.render('profile');
})

module.exports = router;
