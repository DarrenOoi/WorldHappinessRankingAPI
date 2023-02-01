const tinydate = require("tinydate");

//query for accessing public profiles without authorization
const nonAuthenticated = (req, res, next) => {
  const email = req.params.email;
  const authorization = req.headers.authorization;

  if (!authorization) {
    req.db
      .from("users")
      .first("email", "firstName", "lastName")
      .where("email", email)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        res.json({ Error: true, Message: "Error in MySQL query" });
      });
    return;
  } else {
    //if theres authorization
    next();
  }
};

//query for accessing authenticated profiles with matching authorization
const Authenticated = (req, res, next) => {
  const email = req.params.email;

  //check if email associated to the token provided is the same as email of the authenticated profile being accessed
  if (email === res.locals.currentUser) {
    req.db
      .from("users")
      .first("email", "firstName", "lastName", "dob", "address")
      .where("email", "=", email)
      .then((result) => {
        if (result.dob !== null) {
          //changes dob to correct format
          result.dob = tinydate("{YYYY}-{MM}-{DD}")(result.dob);
        }

        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        res.json({ Error: true, Message: "Error in MySQL query" });
      });
  } else {
    // if email associated with token provided and email of authenticated profile being accessed does not match, return public profile
    req.db
      .from("users")
      .first("email", "firstName", "lastName")
      .where("email", email)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        res.json({ Error: true, Message: "Error in MySQL query" });
      });
  }
};

module.exports = {
  nonAuthenticated,
  Authenticated,
};
