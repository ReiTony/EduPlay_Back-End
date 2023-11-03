const Student = require("../models/studentSchema");
const AssessmentRecord = require("../models/assessmentRecordsSchema");
const { getModuleSync } = require("./moduleController");

const createAssessmentRecord = async (req, res) => {
  try {
    const { moduleNumber, userId, answers } = req.body;
    if (!moduleNumber || !userId || !answers) return res.status(400).json({ message: "moduleNumber, userId, and answers are required." });
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    if ((await AssessmentRecord.find({ studentId: userId, gradeLevel: student.gradeLevel, moduleNumber })).length > 0) return res.status(400).json({ message: "You have already taken this assessment!" });
    const module = getModuleSync(moduleNumber, student.gradeLevel, "assessment");
    if (module.questions.length !== answers.length) return res.status(400).json({ message: `The number of questions (${module.questions.length}) and answer (${answers.length}) does not match.` });
    const score = module.questions.reduce((totalScore, question, index) => {
      if (question.correctAnswer === answers[index]) return totalScore + 1;
      return totalScore;
    }, 0);
    const newAssessmentRecord = new AssessmentRecord({ studentId: userId, score: score, moduleNumber, gradeLevel: student.gradeLevel, answers, total: module.questions.length });
    await newAssessmentRecord.save();
    res.status(200).json({ message: "Success", score });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAssessmentRecord };
