const express = require("express");
const router = express.Router();
const { validation } = require("../validation/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const auth = require("../authentication/auth");
const bcrypt = require("bcrypt");
const User = require("../model/User");
const Connectionrequest = require("../model/connectionRequest");

router.use(express.json());
router.use(cookieParser());

// SIGNUP
router.post("/signup", validation, async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, gender, skills } =
      req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      age,
      gender,
      skills,
      password: hashPassword,
    });

    await user.save();

    res.status(200).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).send("Error creating user");
  }
});

// SIGN-IN
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all fields" });
    }
    console.log("step 1", email, password);
    const userdetail = await User.findOne({ email: email });

    if (!userdetail) return res.status(400).send("Invalid emailId");

    const ispassword = await bcrypt.compare(password, userdetail.password);
    console.log("step 2", ispassword);

    if (!ispassword) return res.status(400).send("Invalid password");

    const token = jwt.sign({ id: userdetail._id }, "Gaurav@123", {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res;
    res.status(200).json({
      success: true,
      message: `Successfully login ${userdetail.firstName}`,
      data: userdetail,
    });
  } catch (err) {
    console.log("something went wrong", err.message);
    res.status(500).send("Server error");
  }
});

// CONNECTION TEST
router.get("/connection", auth, async (req, res) => {
  try {
    const user = req.user;
    res.send("Hello " + user.firstName);
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
  });

  res.status(200).send("Logout successful");
});

// EXPORT ROUTER
module.exports = router;
