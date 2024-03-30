const mongoose = require("mongoose");

const AssessmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Student",
    },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    topic: { type: String},
    moduleNumber: { type: Number, required: true },
    gradeLevel: { type: Number, required: true },
    answers: { type: [Number], required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("AssessmentRecord", AssessmentSchema);
