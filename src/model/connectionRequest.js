 const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: 1
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: {
        values: ["interested", "rejected", "accepted", "ignore"],
        message: `{VALUE} is not a valid status`
      },
      required: true,
      // default: "intersted"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("connectionRequest", connectionRequestSchema);
