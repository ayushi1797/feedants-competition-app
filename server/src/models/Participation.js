const mongoose = require("mongoose");

const participationSchema = new mongoose.Schema(
  {
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["REGISTERED", "CANCELLED"],
      default: "REGISTERED"
    },
    registeredAt: { type: Date, default: Date.now },
    cancelledAt: { type: Date, default: null }
  },
  { timestamps: true }
);

participationSchema.index(
  { competitionId: 1, userId: 1 },
  { unique: true }
);

participationSchema.index({ competitionId: 1, status: 1 });

module.exports = mongoose.model("Participation", participationSchema);
