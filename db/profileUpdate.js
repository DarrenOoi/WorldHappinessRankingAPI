const tinydate = require("tinydate");

//query to update profile information
const Update = (req, res) => {
  const FirstName = req.body.firstName;
  const LastName = req.body.lastName;
  const DOB = req.body.dob;
  const Address = req.body.address;
  const email = req.params.email;

  req.db
    .from("users")
    .update({
      firstName: FirstName,
      lastName: LastName,
      dob: DOB,
      address: Address,
    })
    .where("email", email)
    .then(() => {
      //return updated profile
      return req.db
        .from("users")
        .first("email", "firstName", "lastName", "dob", "address")
        .where("email", "=", email)
        .then((result) => {
          if (result.dob !== null) {
            //changes dob to correct format
            result.dob = tinydate("{YYYY}-{MM}-{DD}")(result.dob);
          }
          res.status(200).json(result);
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: "Error in MySQL query" });
    });
};

module.exports = {
  Update,
};
