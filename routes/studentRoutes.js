const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");
const {
  studentLogin,
  studentLogout,
  showCurrentStudent,
} = require("../controllers/studentController");
const {
  recordModuleProgress,
  recordGameScore,
} = require("../controllers/recordController");
const {
  getStudentModule,
  getSummary,
} = require("../controllers/moduleController");
const {
  createAssessmentRecord,
  getAssessmentRecords,
} = require("../controllers/assessmentRecordsController");
const {
  getAllAssessments,
  getAssessmentsGradeLevel,
} = require("../controllers/assessmentController");
const {
  createCustomAssessmentRecord,
} = require("../controllers/customAssessmentRecordController");
const { getAchievements } = require("../controllers/achievementController");

// Student
router.post("/login", studentLogin);
router.delete("/logout", authenticateUser, studentLogout);

// Assessment
router.get("/getAssessmentByGrade/:id", getAssessmentsGradeLevel);
router.get("/assessment", getAllAssessments);

// Achievement
router.get("/achievement/:id", getAchievements);

// Module
router.get("/module", getStudentModule);
router.get("/module-summary", getSummary);

// Record
router.get("/assessment-record", getAssessmentRecords);
router.post("/assessment-record", createAssessmentRecord);
router.post("/custom-assessment-record", createCustomAssessmentRecord);
router.post("/module/:moduleId", recordModuleProgress);
router.post("/game-score", recordGameScore);

router.get("/:id", showCurrentStudent);

module.exports = router;
