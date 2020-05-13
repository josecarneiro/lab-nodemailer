![logo_ironhack_blue 7](https://user-images.githubusercontent.com/23629340/40541063-a07a0a8a-601a-11e8-91b5-2f13e4e6b441.png)

# Sign up Confirmation Email

## Introduction

![image](https://user-images.githubusercontent.com/23629340/37091320-032a2cb0-2208-11e8-8b73-27060f1960c3.png)

Almost every time you register on a new service, you're asked to confirm your account by clicking on a link that's been sent to your email. This is a great way to avoid registering users with wrong or made up information. In this lab, we will do the same exact thing - create an app that will allow users to sign up, but their status will be by default set to `pending_confirmation`. After creating an account, the user should receive a confirmation message with a clickable link that includes a confirmation "token" in the query. After navigating to this link, their status should be changed to `active`. We will use **Nodemailer** for this!

## Requirements

- Fork this repo
- Then clone this repo

## Submission

- Upon completion, run the following commands:

```
$ git add .
$ git commit -m "done"
$ git push origin master
```

- Create Pull Request so your TAs can check up your work.

## Instructions

## Lab Setup

- First you need to install all the dependencies. You might need more installations to successfully complete the lab.

```
$ npm install
```

- Add a .env file with all the required information. You might need to add more enviromental variables to the .env file to successfully complete the lab.

```
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/lab-nodemailer
NODE_ENV=development
SESSION_SECRET=thislabrules
```

- Run the server to check that all the setup has been completed. You should be able to see the index view.

```
npm run dev
```

### Iteration 1 - User Model

First, we need to modify the `User` model. Inside the `models` folder, you will find a `user.js` file. We already have the `email` and `password` fields, so we need to add the followings:

- **`status`** - will be a string, and you should add an `enum` because the only possible values are: _"Pending Confirmation"_ or _"Active"_. By default, when a new user is created, it will be set to _"Pending Confirmation"_.
- **`confirmationCode`** - here we will store a confirmation code; it will be unique for each user.

### Iteration 2 - Signup Process

#### Adding the new fields

On the `auth/signup.hbs` file you have an `input` tag for the **email**. When the user clicks on the `signup` button, you should store the following values in the database:

- **password** - after hashing the value of the `password` field from the `req.body`;
- **email** - from the `req.body`;
- **confirmationCode** - for creating a confirmation code, you can use any methodology, from installing the npm package for email verification to simplest `Math.random()` function on some string.

Example:

```js
const generateId = (length) => {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};
```

Now, you have to store the token in the `confirmationCode` field.

#### Sending the email

After creating the user, you should send the email to the address the user put on the `email` field. Remember to use **Nodemailer** for this. You should include the following URL in the email:

`http://localhost:3000/auth/confirm/THE-CONFIRMATION-CODE-OF-THE-USER`

### Iteration 3 - Confirmation Route

When the user clicks on the URL we included in the email, we should make a comparison of the `confirmationCode` on the URL and the one in the database. You should create a route: `/confirm/:confirmCode` inside the `routes/auth.js` file.

Inside the route, after comparing the confirmation code, you have to set the `status` field of the user to 'Active'. Then render a `confirmation.hbs` view, letting the user know that everything went perfect, or showing the error.

### Iteration 4 - Profile View

Finally, you have to create a `profile.hbs` view, where you have to render the `name` and the `status` of the user.

### Bonus! Styling the Email

Sending the email that contains only the URL is super boring! Feel free to style it better.

![image](https://user-images.githubusercontent.com/23629340/37099024-ab0d7c9a-221f-11e8-9458-49f813437e2c.png)

Happy Coding! 💙
