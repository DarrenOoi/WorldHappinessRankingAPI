//perform checks to parameters of countries route
const countryCheck = (req, res, next) => {
  //check if any parameters exist
  queryParams = Object.keys(req.query);
  if (queryParams.length > 0) {
    res.status(400).json({
      error: true,
      message: "Invalid query parameters. Query parameters are not permitted.",
    });
    return;
  } else next();
};

//perform checks to parameters of rankings route
const rankingsCheck = (req, res, next) => {
  //check if parameters other than year or country exists
  queryParams = Object.keys(req.query);
  const excessParams = queryParams.filter(
    (params) => params !== "year" && params !== "country"
  );
  if (excessParams.length > 0) {
    res.status(400).json({
      error: true,
      message: "Invalid query parameters. Only year and country are permitted.",
    });
    return;
  }
  //check if country parameter contains numbers with regex expression
  if (req.query.country) {
    if (req.query.country.match(/[0-9]+/)) {
      res.status(400).json({
        error: true,
        message:
          "Invalid country format. Country query parameter cannot contain numbers.",
      });
      return;
    }
  }

  //check if year format is correct
  if (req.query.year) {
    if (req.query.year.length != 4) {
      res.status(400).json({
        error: true,
        message: "Invalid year format. Format must be yyyy.",
      });
      return;
    }
  }
  next();
};

//perform checks to parameters of factors route
const factorsCheck = (req, res, next) => {
  //check if parameters other than limit or country exists
  queryParams = Object.keys(req.query);
  const excessParams = queryParams.filter(
    (params) => params !== "limit" && params !== "country"
  );
  if (excessParams.length > 0) {
    res.status(400).json({
      error: true,
      message:
        "Invalid query parameters. Only limit and country are permitted.",
    });
    return;
  }

  //check if country parameter contains numbers with regex expression
  if (req.query.country) {
    if (req.query.country.match(/[0-9]+/)) {
      res.status(400).json({
        error: true,
        message:
          "Invalid country format. Country query parameter cannot contain numbers.",
      });
      return;
    }
  }

  //check if year format is correct
  if (req.params.year.length != 4) {
    res.status(400).json({
      error: true,
      message: "Invalid year format. Format must be yyyy.",
    });
    return;
  }

  //check if limit parameter is a positive number without decimals or letters
  if (req.query.limit) {
    if (
      req.query.limit < 0 ||
      req.query.limit.match(/\d+(\.\d+)/) ||
      req.query.limit.match(/[a-z]+/)
    ) {
      res.status(400).json({
        error: true,
        message: "Invalid limit query. Limit must be a positive number.",
      });
      return;
    }
  }
  next();
};

module.exports = {
  countryCheck,
  rankingsCheck,
  factorsCheck,
};
