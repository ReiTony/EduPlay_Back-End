const mongoose = require("mongoose");

const BadgeSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Student" },
    total: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    category: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Badge", BadgeSchema);
