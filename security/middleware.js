const jwt = require("jsonwebtoken");

//middleware to check if token is valid
const authorize = (req, res, next) => {
  const authorization = req.headers.authorization;
  const secretKey = "secret key";
  let token = null;

  //check if token is provided
  if (!authorization) {
    res.status(401).json({
      error: true,
      message: "Authorization header ('Bearer token') not found",
    });
    return;
  }

  //check if token is in the right form and retrieve token
  if (authorization && authorization.split(" ").length === 2) {
    token = authorization.split(" ")[1];
  } else {
    res
      .status(401)
      .json({ error: true, message: "Authorization header is malformed" });
    return;
  }

  //verify jwt and check expiry
  try {
    const decoded = jwt.verify(token, secretKey);
    res.locals.currentUser = decoded.email;

    if (decoded.exp < Date.now()) {
      res.status(401).json({ error: true, message: "Token Expired" });
      return;
    }

    //Permit user to advance to route
    next();
  } catch (e) {
    res.status(401).json({ error: true, message: "Invalid JWT token" });
    return;
  }
};
module.exports = {
  authorize,
};
