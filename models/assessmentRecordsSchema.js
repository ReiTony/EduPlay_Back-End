const mongoose = require("mongoose");

const AssessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Student",
    },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    moduleNumber: { type: Number, required: true },
    gradeLevel: { type: Number, required: true },
    answers: { type: [Number], required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("AssessmentRecord", AssessmentSchema);
