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
    assessmentGradeLevel: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Class',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", AssessmentSchema);
