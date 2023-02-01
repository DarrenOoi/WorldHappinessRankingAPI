//check if required fields are provided
const userCheck = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  //Verify body
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password are needed",
    });
    //return prevents further code from running
    return;
  } else next();
};

module.exports = {
  userCheck,
};
