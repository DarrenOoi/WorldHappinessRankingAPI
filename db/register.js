const bcrypt = require("bcryptjs");

const Register = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  req.db
    .from("users")
    .select("*")
    .where("email", "=", email)
    .then((users) => {
      //check if user already exists in database
      if (users.length > 0) {
        res.status(409).json({
          error: true,
          message: "User already exists",
        });
        return;
      }
      const saltRounds = 10;
      //encrypt password
      const hash = bcrypt.hashSync(password, saltRounds);
      //Insert into DB
      return req.db.from("users").insert({ email, hash });
    })
    .then(() => {
      res
        .status(201)
        .json({ success: true, message: "User successfully created" });
    });
};

module.exports = {
  Register,
};
