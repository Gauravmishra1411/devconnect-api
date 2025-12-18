 const express = require("express");
const router = express.Router();
const auth = require("../authentication/auth");
const Connectionrequest = require("../model/connectionRequest");
const User = require("../model/User");

router.get("/feed", auth, async (req, res) => {
  try {
    const loggedUser = req.user._id;

    // 1️⃣ Find all users already connected / requested
    const connectionRequests = await Connectionrequest.find({
      $or: [
        { toUserId: loggedUser },
        { fromUserId: loggedUser }
      ],
      status: "interested"
    }).select("fromUserId toUserId");

    // 2️⃣ Create a set of users to hide from feed
    const hideFromFeed = new Set();
    hideFromFeed.add(loggedUser.toString());

    connectionRequests.forEach((req) => {
      hideFromFeed.add(req.fromUserId.toString());
      hideFromFeed.add(req.toUserId.toString());
    });

    // 3️⃣ Fetch users NOT in hideFromFeed
    const users = await User.find({
      _id: { $nin: Array.from(hideFromFeed) }
    }).select("firstName lastName photoUrl");

    res.status(200).json({
      message: "Users you can send friend request",
      data: users
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error in feed API",
      error: err.message
    });
  }
});

module.exports = router;
