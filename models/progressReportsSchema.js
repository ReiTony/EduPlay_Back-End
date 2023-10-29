const mongoose = require("mongoose");

const ProgressReportSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    moduleId: {
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
        assessmentId: {
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
    gameScores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GameScore",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProgressReport", ProgressReportSchema);
