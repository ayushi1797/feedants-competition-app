const mongoose = require("mongoose");

const competitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    registrationOpenAt: { type: Date, required: true },
    registrationCloseAt: { type: Date, required: true },
    capacity: { type: Number, default: null, min: 1 },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "PUBLISHED"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Competition", competitionSchema);
