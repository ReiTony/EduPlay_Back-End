const mongoose = require("mongoose");

const ProgressReportSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    unlockedModules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
    modules: [
      {
        moduleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Module",
        },
        is_module_completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    assessmentScores: [
      {
        assessmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Assessment",
        },
        score: {
          type: Number,
          default: 0,
        },
      },
    ],
    gameScores: [
      {
        gameScoreId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "GameScore",
        },
        gameType: {
          type: String,
          required: true,
        },
        score: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalGameScore: {
      type: Number,
      default: 0,
    },
    averageAssessmentScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const ProgressReport = mongoose.model("ProgressReport", ProgressReportSchema);

module.exports = ProgressReport;
