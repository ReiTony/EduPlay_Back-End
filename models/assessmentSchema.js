const mongoose = require("mongoose");

const AssessmentSchema = new mongoose.Schema(
  {
    questions: {
      type: Array,
      default: [],
    },
    answers: {
      type: Array,
      default: [],
    },
    gradeLevel: {
      type: String,
      enum: ["1", "2", "3"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", AssessmentSchema);