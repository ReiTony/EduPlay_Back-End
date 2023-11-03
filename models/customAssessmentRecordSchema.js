const mongoose = require("mongoose");

const AssessmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Student" },
    assessment: { type: mongoose.Schema.Types.ObjectId, required: true, refL: "Assessment" },
    // score: { type: Number, required: true },
    // total: { type: Number, required: true },
    answers: { type: [Number], required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("CustomAssessmentRecord", AssessmentSchema);
