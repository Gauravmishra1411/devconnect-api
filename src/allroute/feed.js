const express = require("express");
const router = express.Router();
const auth = require("../authentication/auth");
const Connectionrequest = require("../model/connectionRequest");
const User = require("../model/User");

router.get("/feed", auth, async (req, res) => {
  try {
    const loggedUser = req.user._id;

    // 1️⃣ Find all connection requests
    const connectionRequests = await Connectionrequest.find({
      $or: [{ status: "interested" }, { status: "rejected" }],

      $or: [{ toUserId: loggedUser }, { fromUserId: loggedUser }],
    }).select("fromUserId toUserId");

    // 2️⃣ Create hide list (Set)
    const hideFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideFromFeed.add(req.fromUserId.toString());
      hideFromFeed.add(req.toUserId.toString());
    });

    // remove self
    hideFromFeed.add(loggedUser.toString());

    // 3️⃣ Convert Set → Array → ObjectId
    console.log(hideFromFeed, "setobjected");

    const hideIds = Array.from(hideFromFeed);
    console.log(hideIds, "from Array");

    // 4️⃣ Fetch users NOT in hide list
    const users = await User.find({
      _id: { $nin: hideIds },
    }).select("firstName lastName photoUrl");

    res.status(200).json({
      message: "Users you can send friend request",
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in feed API",
      error: err.message,
    });
  }
});

module.exports = router;
