const Assessment = require("../models/assessmentSchema");
const CustomAssessmentRecord = require("../models/customAssessmentRecordSchema");
const Notification = require("../models/notificationSchema");

const createCustomAssessmentRecord = async (req, res) => {
  try {
    const { assessment, student, answers } = req.body;
    if (!assessment || !student || !answers)
      return res
        .status(400)
        .json({ message: "assessment, student, and answers are required" });
    const foundAssessment = await Assessment.findById(assessment);
    if (!foundAssessment)
      return res.status(404).json({ message: "Assessment not found" });
    const assessmentTitle = foundAssessment.title;
    if (foundAssessment.questions.length !== answers.length)
      return res.status(400).json({
        message: `The number of questions (${foundAssessment.questions.length}) and answer (${answers.length}) does not match.`,
      });

    // Calculate the score
    let score = 0;
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] === foundAssessment.questions[i].correctAnswer) {
        score++;
      }
    }
    const newCustomAssessmentRecord = new CustomAssessmentRecord({
      student,
      assessment,
      answers,
    });
    await newCustomAssessmentRecord.save();
    // Create notification
    const notificationMessage = `You scored ${score}/${foundAssessment.questions.length} in "${foundAssessment.title}"`;
    const notification = new Notification({
      message: notificationMessage,
      recipient: student,
    });
    await notification.save();

    res.status(201).json({ message: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const getCustomAssessmentAnalysis = async (req, res) => {
  try {
    const allAssessments = await Assessment.find({}).lean();
    let analysis = [];
    for (const assessment of allAssessments) {
      const records = await CustomAssessmentRecord.find({
        assessment: assessment._id,
      }).lean();
      for (let i = 0; i < assessment.questions.length; i++) {
        let total = 0;
        let correct = 0;
        records.forEach((record) => {
          if (record.answers[i] === assessment.questions[i].correctAnswer)
            correct++;
          total++;
        });
        assessment.questions[i].correct = correct;
        assessment.questions[i].total = total;
        if (total === 0) assessment.questions[i].analysis = 0;
        else
          assessment.questions[i].analysis = Math.round(
            (correct / total) * 100
          );
      }
      analysis.push(assessment);
    }
    res.status(200).json({ message: "Success", request: analysis });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCustomAssessmentRecord, getCustomAssessmentAnalysis };
