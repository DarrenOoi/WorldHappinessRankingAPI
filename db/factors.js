// query to return factors data
const factorsQuery = (req, res) => {
  req.db
    .from("rankings")
    .select(
      "rank",
      "country",
      "score",
      "economy",
      "family",
      "health",
      "freedom",
      "generosity",
      "trust",
      "year"
    )
    .modify(function (queryBuilder) {
      if (req.query.limit && req.query.country) {
        queryBuilder.where("country", req.query.country).limit(req.query.limit);
      } else if (req.query.limit) {
        queryBuilder.limit(req.query.limit);
      } else if (req.query.country) {
        queryBuilder.where("country", req.query.country);
      }
    })
    .where("year", req.params.year)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: "Error in MySQL query" });
    });
};
module.exports = {
  factorsQuery,
};
