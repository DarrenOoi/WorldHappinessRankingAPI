//perform checks to body of update route
const updateCheck = (req, res, next) => {
  const FirstName = req.body.firstName;
  const LastName = req.body.lastName;
  const DOB = req.body.dob;
  const Address = req.body.address;
  const email = req.params.email;

  //check if required fields are provided
  if (!FirstName || !LastName || !DOB || !Address) {
    res.status(400).json({
      error: true,
      message:
        "Request body incomplete: firstName, lastName, dob and address are required.",
    });
    //return prevents further code from running
    return;
  }

  //check if first name, last name and address provided are strings
  if (
    typeof FirstName !== "string" ||
    typeof LastName !== "string" ||
    typeof Address !== "string"
  ) {
    res.status(400).json({
      error: true,
      message:
        "Request body invalid, firstName, lastName and address must be strings only.",
    });
    return;
  }

  //convert DOB provided to date object
  var dobCheck = new Date(DOB);
  //create date object of date now
  var dateNow = new Date(Date.now());

  //split dob into array of [year,month,day]
  var dateInput = DOB.split("-");
  //convert dob date object to string
  var dateOutput = dobCheck.getDate().toString();
  //regex expression to ensure DOB is in the correct format
  var date_regex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

  //check if DOB is in correct format and if it is a real date
  if (!date_regex.test(DOB) || dateOutput !== dateInput[2]) {
    res.status(400).json({
      error: true,
      message: "Invalid input: dob must be a real date in format YYYY-MM-DD.",
    });
    return;
  }

  //check if DOB provided is in the past
  if (dateNow < dobCheck) {
    res.status(400).json({
      error: true,
      message: "Invalid input: dob must be a date in the past.",
    });
    return;
  }

  //check if email associated with token provided and email of profile being updated matches
  if (email === res.locals.currentUser) {
    next();
  } else
    res.status(403).json({
      error: true,
      message: "Forbidden",
    });
};

//check if user exists in the database
const userExists = (req, res, next) => {
  const email = req.params.email;

  //check if email exists
  req.db
    .from("users")
    .count("email as number")
    .where("email", "=", email)
    .then((result) => {
      if (result[0].number === 0) {
        res.status(404).json({
          error: true,
          message: "User not found",
        });
        return;
      } else next();
    });
};

module.exports = {
  updateCheck,
  userExists,
};
