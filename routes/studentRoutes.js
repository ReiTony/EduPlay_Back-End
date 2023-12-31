const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");
const {
  studentLogin,
  studentLogout,
  showCurrentStudent,
} = require("../controllers/studentController");
const {
  recordAssessmentScore,
  recordModule,
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
const { getNotifications } = require("../controllers/notificationController");
const { getProgressReportByStudent } = require("../controllers/progressReportController");
const { getSingleModule } = require("../controllers/fileController");

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
router.get("/module/:id", getSingleModule);

// Record
router.post("/assessment-score/:assessmentId", recordAssessmentScore);
router.get("/assessment-record", getAssessmentRecords);
router.post("/assessment-record", createAssessmentRecord);
router.post("/custom-assessment-record", createCustomAssessmentRecord);
router.post("/module-record", recordModule);
router.post("/game-score", recordGameScore);

//Progress Report
router.get("/progress-report/:username", getProgressReportByStudent);

// Notification
router.get("/notifications", getNotifications)
  
router.get("/:id", showCurrentStudent);

module.exports = router;
