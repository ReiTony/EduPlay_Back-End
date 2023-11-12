const Student = require("../models/studentSchema");
const Notification = require("../models/notificationSchema");
const Achievement = require("../models/achievementSchema");
const AssessmentRecord = require("../models/assessmentRecordsSchema");
const { getModuleSync } = require("./moduleController");

const getAssessmentRecords = async (req, res) => {
  try {
    const { moduleNumber, studentId, gradeLevel } = req.query;
    let query = {};
    if (moduleNumber) query.moduleNumber = moduleNumber;
    if (gradeLevel) query.gradeLevel = gradeLevel;
    if (studentId) query.studentId = studentId;

    const assessments = await AssessmentRecord.find(query);
    res.status(200).json({ message: "Success", request: assessments });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const createAssessmentRecord = async (req, res) => {
  try {
    const { moduleNumber, userId, answers, assessment } = req.body;
    if (!moduleNumber || !userId || !answers)
      return res
        .status(400)
        .json({ message: " moduleNumber, userId, and answers, are required." });
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    let categories = new Array(assessment.categories.length).fill(0);
    const score = assessment.questions.reduce((totalScore, question, index) => {
      if (question.correctAnswer === answers[index]) return totalScore + 1;
      else categories[question.category]++;
      return totalScore;
    }, 0);

    let recommendation = "";
    if (Math.max(...categories) === 0)
      recommendation = `You scored ${score}/${score} on the '${assessment.title}' assessment! Keep up the good work!`;
    else
      recommendation = `You scored ${score}/${
        assessment.questions.length
      } on the '${
        assessment.title
      }'. Consider studying more about ${getMaxWrongAnswers(
        categories,
        assessment.categories
      )} to help boost your score!`;

    const fields = {
      title: assessment.title,
      studentId: userId,
      score: score,
      moduleNumber,
      gradeLevel: student.gradeLevel,
      answers,
      total: assessment.questions.length,
    };

    // overwrite assessment if the assessment in db has a lower score
    const foundAssessment = await AssessmentRecord.find({
      studentId: userId,
      gradeLevel: student.gradeLevel,
      moduleNumber,
    }).lean();
    if (foundAssessment.length === 0) await new AssessmentRecord(fields).save();
    else if (foundAssessment[0].score < score)
      await AssessmentRecord.findOneAndUpdate(
        {
          studentId: userId,
          gradeLevel: student.gradeLevel,
          moduleNumber,
          score: { $lt: score },
        },
        fields
      );

    // Determine the badge based on the score
    const badge = getBadge(score);

    // Create notification with badge information
    let notificationMessage = `You scored ${score}/${assessment.questions.length} in "${assessment.title}".`;
    if (badge) {
      notificationMessage += ` You earned a ${badge} badge!`;

      if (badge === "gold") {
        notificationMessage += " Congratulations!";
      } else if (badge === "silver") {
        notificationMessage += " Well done!. Keep it up!";
      } else if (badge === "bronze") {
        notificationMessage +=
          " Good effort! Review a bit more and try to take the test again.";
      }
    } else {
      notificationMessage +=
        " Review a bit more and try to take the test again.";
    }

    const notification = new Notification({
      message: notificationMessage,
      recipient: userId,
    });
    await notification.save();

    // Add Achievement
    try {
      const achievement = new Achievement({
        student: userId,
        moduleOrAssessmentTitle: assessment.title,
        completed: true,
      });
      await achievement.save();
    } catch (error) {}

    res.status(200).json({
      message: "Success",
      score,
      recommendation,
      total: assessment.questions.length,
      badge,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

function getBadge(score) {
  if (score === 10) {
    return "gold";
  } else if (score > 4 && score < 10) {
    return "silver";
  } else if (score === 4) {
    return "bronze";
  } else {
    return null; 
  }
}

const getMaxWrongAnswers = (arr, categories) => {
  let max = Math.max(...arr);
  let maxIndices = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === max) maxIndices.push(categories[i]);
  }
  return maxIndices.join(", ");
};

module.exports = { getAssessmentRecords, createAssessmentRecord };
