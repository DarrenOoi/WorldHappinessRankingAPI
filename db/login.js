const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//query to check if email exists in database and if password matches the email provided
const Login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  req.db
    .from("users")
    .select("*")
    .where("email", "=", email)
    .then((users) => {
      //check if email exists in database
      if (users.length == 0) {
        res.status(401).json({
          error: true,
          message: "Incorrect email or password",
        });
        return;
      }
      const user = users[0];
      //encrypt password and check if it matches encrypted password in database
      return bcrypt.compare(password, user.hash);
    })
    //check if passwords match
    .then((match) => {
      if (!match) {
        res.status(401).json({
          error: true,
          message: "Incorrect email or password",
        });
        return;
      }

      //secret key to ensure individuals without secret key will be unable to generate tokens in the same fashion
      const secretKey = "secret key";
      const expires_in = 60 * 60 * 24; //1Day
      const exp = Date.now() + expires_in * 1000;
      //generate token with email with expiry date in one day
      const token = jwt.sign({ email, exp }, secretKey);
      res.status(200).json({ token, token_type: "Bearer", expires_in });
    });
};
module.exports = {
  Login,
};
