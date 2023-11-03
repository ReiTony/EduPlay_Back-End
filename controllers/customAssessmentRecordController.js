const Assessment = require("../models/assessmentSchema");
const CustomAssessmentRecord = require("../models/customAssessmentRecordSchema");

const createCustomAssessmentRecord = async (req, res) => {
  try {
    const { assessment, student, answers } = req.body;
    if (!assessment || !student || !answers) return res.status(400).json({ message: "assessment, student, and answers are required" });
    const foundAssessment = await Assessment.findById(assessment);
    if (!foundAssessment) return res.status(404).json({ message: "Assessment not found" });
    if (foundAssessment.questions.length !== answers.length) return res.status(400).json({ message: `The number of questions (${foundAssessment.questions.length}) and answer (${answers.length}) does not match.` });
    const newCustomAssessmentRecord = new CustomAssessmentRecord({ student, assessment, answers });
    await newCustomAssessmentRecord.save();
    res.status(201).json({ message: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const getCustomAssessmentAnalysis = async (req, res) => {
  try {
    const { assessment } = req.query;
    const records = await CustomAssessmentRecord.find({ assessment }).lean();
    const foundAssessment = await Assessment.findById(assessment).lean();
    if (!foundAssessment) return res.status(404).json({ message: "Assessment not found!" });
    for (let i = 0; i < foundAssessment.questions.length; i++) {
      let total = 0;
      let correct = 0;
      records.forEach((record) => {
        if (record.answers[i] === foundAssessment.questions[i].correctAnswer) correct++;
        total++;
      });
      foundAssessment.questions[i].analysis = Math.round((correct / total) * 100);
    }
    res.status(200).json({ message: "Success", request: foundAssessment });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCustomAssessmentRecord, getCustomAssessmentAnalysis };
