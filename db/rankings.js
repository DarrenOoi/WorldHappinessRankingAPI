//query to return list of all countries in database
const countryQuery = (req, res) => {
  req.db
    .distinct()
    .from("rankings")
    .select("country")
    .orderBy("country", "asc")
    .then((rows) => {
      //map results into a new array
      const countryArr = rows.map((row) => row.country);
      res.status(200).json(countryArr);
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: "Error in MySQL query" });
    });
};

//query to return rankings of countries in database with optional year and country queries
const rankingsQuery = (req, res) => {
  req.db
    .from("rankings")
    .select("rank", "country", "score", "year")
    .modify(function (queryBuilder) {
      if (req.query.year && req.query.country) {
        queryBuilder
          .where("year", req.query.year)
          .andWhere("country", req.query.country);
      } else if (req.query.year) {
        queryBuilder.where("year", req.query.year);
      } else if (req.query.country) {
        queryBuilder.where("country", req.query.country);
      }
    })
    .orderBy("year", "desc")
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: "Error executing MySQL query" });
    });
};

module.exports = {
  countryQuery,
  rankingsQuery,
};
