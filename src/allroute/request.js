const express = require("express");
const router = express.Router();
const auth = require("../authentication/auth");
const Connectionrequest = require("../model/connectionRequest");

// Get all pandding request
router.get("/user/request", auth, async (req, res) => {
  try {
    const loggedinuser = req.user._id;

    const connectionRecevied = await Connectionrequest.find({
      toUserId: loggedinuser,
      status: "interested", // use same spelling you save in DB
    })
      .populate("fromUserId", "firstName lastName photoUrl")
      .populate("toUserId", "firstName lastName");
    console.log(connectionRecevied, "===============>");

    return res.status(200).json({
      message: "All interested connection requests received",
      data: connectionRecevied,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
});
//all accept
router.get("/user/connection/accepted", auth, async (req, res) => {
  try {
    const loggedUser = req.user._id;

    const connectionRequest = await Connectionrequest.find({
      $or: [
        { toUserId: loggedUser, status: "accepted" },
        { fromUserId: loggedUser, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName photoUrl")
      .populate("toUserId", "firstName lastName photoUrl");

    res.status(200).json({
      message: "All accepted connections fetched successfully",
      data: connectionRequest,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error in get request",
      error: err.message,
    });
  }
});

module.exports = router;
