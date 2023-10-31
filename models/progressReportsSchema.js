const mongoose = require("mongoose");

const ProgressReportSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  modules: [
    {
      moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
      moduleProgress: {
        type: Number,
        default: 0,
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
},{timestamps: true});

const ProgressReport = mongoose.model("ProgressReport", ProgressReportSchema);

module.exports = ProgressReport;
