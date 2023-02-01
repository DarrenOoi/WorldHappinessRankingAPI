const express = require("express");
const router = express.Router();
const middleware = require("../security/middleware.js");
const db = require("../db/register.js");
const user = require("../db/login.js");
const profile = require("../db/profileUpdate.js");
const profileGet = require("../db/profileGet.js");
const logs = require("../logs/profile.js");
const userLog = require("../logs/user.js");

//perform checks, if successful, insert data to database
router.post("/register", userLog.userCheck, db.Register);
//perform checks, if successful, generate token
router.post("/login", userLog.userCheck, user.Login);

//check if token is valid, perform body checks, check if user exists, update profile if token and user matches
router.put(
  "/:email/profile",
  middleware.authorize,
  logs.updateCheck,
  logs.userExists,
  profile.Update
);

//check if user exists, check if token is being provided, if not, return public profile
//if token is provided, check if token is valid, return authenticated profile if token and profile being accessed belongs to same user
router.get(
  "/:email/profile",
  logs.userExists,
  profileGet.nonAuthenticated,
  middleware.authorize,
  profileGet.Authenticated
);

module.exports = router;
