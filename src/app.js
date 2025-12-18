 const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
// ROUTES
const connection = require("./allroute/connection");
const Profile = require("./allroute/Profile");
const UserDetail = require("./allroute/User");
const requestRoute = require("./allroute/request");
const feedRoute=require("./allroute/feed")

// DB & Model
const connectDB = require("./connection/connection");
const User = require("./model/User");  // ✅ FIX: User model imported

const port = 8000;
//env
 
// MIDDLEWARE
 
app.use(cors({
  origin: "https://dev-connect-silk.vercel.app", // frontend URL
  credentials: true,               // allow cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  // allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

// ROUTERS
app.use("/", connection);
app.use("/", Profile);
app.use("/", UserDetail);
app.use("/", requestRoute);
app.use('/',feedRoute)

// DEFAULT ROUTE
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ================================
// GET all users
// ================================
app.get("/alldetail", async (req, res) => {
  try {
    const userdetail = await User.find({});
    res.status(200).json(userdetail);
  } catch (err) {
    console.log("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ================================
// GET user by ID
// ================================
app.get("/byfindid/:id", async (req, res) => {
  try {
    const id = req.params.id;   // ✅ FIX: using params (correct)
    const userdetail = await User.findById(id);

    if (!userdetail) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userdetail);
  } catch (err) {
    console.log("Error fetching user:", err);
    res.status(500).json({ message: "Error fetching user" });
  }
});



// ================================
// Update user by ID
// ================================
app.patch("/update/:userid", async (req, res) => {
  try {
    const userid = req.params.userid;
    const data = req.body;

    const updated = await User.findByIdAndUpdate(
      userid,
      data,
      { new: true }        // return updated data
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Successfully updated user",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
});

// ================================
// CONNECT DB & START SERVER
// ================================

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });

