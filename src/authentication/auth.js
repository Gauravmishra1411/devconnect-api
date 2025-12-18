const jwt = require("jsonwebtoken");
const User = require("../model/User");

 

const auth = async (req, res, next) => {
  try {
    // extract token from cookies
    const token =req.cookies.token
    console.log(token,"token from the req.cookies")
   // use cookies not cookie

    if (!token) {
      return res.status(401).send("User is not valid");
    }

    // verify token
    const decode = jwt.verify(token, "Gaurav@123");

    // decode contains payload → get id
    console.log("decode from verify",decode)
    const userId = decode.id;
console.log("only id",userId)
    // check user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).send("User not found");
    }

    req.user = user; // attach user to request
    next();          // move to next middleware
  } catch (err) {
    console.log(err);
    res.status(401).send("Invalid token");
  }
};

module.exports = auth;
