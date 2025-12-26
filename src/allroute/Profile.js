 const express = require("express");
const router = express.Router();
const auth = require("../authentication/auth");
const User = require("../model/User");
const Connectionrequest = require("../model/connectionRequest");

// SEND CONNECTION REQUEST
router.post("/connection/send/:status/:toUserId", auth, async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    const { toUserId, status } = req.params;

    const allowStatus = ["interested", "rejected"];
    if (!allowStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid request status." });
    }

    if (toUserId == loggedUserId) {
      return res.status(400).json({ message: "You cannot send a request to yourself." });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "Target user not found." });
    }

    const existingReq = await Connectionrequest.findOne({
      $or: [
        { fromUserId: loggedUserId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: loggedUserId }
      ]
    });

    if (existingReq) {
      return res.status(400).json({ message: "Connection request already exists!" });
    }

    const sendConnection = new Connectionrequest({
      fromUserId: loggedUserId,
      toUserId,
      status,
    });

    await sendConnection.save();

    res.status(200).json({
      message: `${req.user.firstName} has sent a request to ${toUser.firstName}`,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});


// ACCEPT CONNECTION REQUEST
router.post("/connection/request/:status/:torecivedid", auth, async (req, res) => {
  try {
    const fromUser = req.user._id;
    const { status, torecivedid } = req.params;

    if (status !== "accepted") {
      return res.status(400).json({ message: "Invalid status. Only accepted is allowed." });
    }

    if (torecivedid == fromUser) {
      return res.status(400).json({ message: "You cannot accept your own request." });
    }

    const connectionRequest = await Connectionrequest.findOne({
      toUserId: torecivedid,
      status: "interested"
    });

    if (!connectionRequest) {
      return res.status(404).json({
        message: "No valid connection request found to accept."
      });
    }

    connectionRequest.status = "accepted";
    await connectionRequest.save();

    res.status(200).json({
      message: "Connection request accepted successfully!"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
