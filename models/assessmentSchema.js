const mongoose = require("mongoose")

const AssessmentSchema = new mongoose.Schema(
  {
    assessmentNumber: {
      type: Number,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    questions: [{
      question: String,
      choices: [String],
      correctAnswer: Number,
    }],
    answers: [{
      answer: String, 
    }],
    gradeLevel: {
      type: String,
      enum: ["1", "2", "3"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", AssessmentSchema);