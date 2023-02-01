const express = require("express");
const router = express.Router();
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./../swagger.json");
const middleware = require("../security/middleware.js");
const db = require("../db/rankings.js");
const database = require("../db/factors.js");
const logs = require("../logs/index.js");

//set up swagger docs on default route
router.use("/", swaggerUI.serve);
router.get("/", swaggerUI.setup(swaggerDocument));

//perform parameter checks, if successful, query database
router.get("/countries", logs.countryCheck, db.countryQuery);
router.get("/rankings", logs.rankingsCheck, db.rankingsQuery);

//check if token is valid,perform parameter checks,query database
router.get(
  "/factors/:year",
  middleware.authorize,
  logs.factorsCheck,
  database.factorsQuery
);

http: module.exports = router;
