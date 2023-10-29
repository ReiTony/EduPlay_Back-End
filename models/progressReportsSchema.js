const mongoose = require("mongoose");

const ProgressReportSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    moduleProgress: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    assessmentScores: [
      {
        assessment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Assessment",
          required: true,
        },
        score: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProgressReport", ProgressReportSchema);
