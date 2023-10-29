const mongoose = require("mongoose");

const ProgressReportSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    moduleId: {
      type: Number,
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
        assessmentId: {
          type: Number,
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
