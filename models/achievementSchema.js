const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", 
    required: true,
  },
  moduleOrAssessmentTitle: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Achievement = mongoose.model("Achievement", achievementSchema);

module.exports = Achievement;
