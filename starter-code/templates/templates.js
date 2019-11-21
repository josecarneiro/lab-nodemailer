module.exports = {
        templateExample: (user) => {
            return `<style>b { color:purple; text-align: center} body {text-align: center;}</style>
            <h2>Ironhack Confirmation E-mail <h2>
            <h3>Hello ${user.name}</h3>
            <b>Please confirm your email by clicking <a href="http://localhost:3000/confirm/${user.confirmationCode}">here</a></b>`
        }}