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
} = require("../controllers/assessmentRecordsController");
const {
  getAllAssessments,
  getAssessmentsGradeLevel,
} = require("../controllers/assessmentController");
const {
  createCustomAssessmentRecord,
} = require("../controllers/customAssessmentRecordController");

// Student
router.get("/:id", showCurrentStudent);
router.post("/login", studentLogin);
router.delete("/logout", authenticateUser, studentLogout);

// Assessment
router.get("/getAssessmentByGrade/:id", getAssessmentsGradeLevel);
router.get("/assessment", getAllAssessments);

// Module
router.get("/module", getStudentModule);
router.get("/module-summary", getSummary);

// Record
router.post("/assessment-record", createAssessmentRecord);
router.post("/custom-assessment-record", createCustomAssessmentRecord);
router.post("/module/:moduleId", recordModuleProgress);
router.post("/game-score", recordGameScore);

module.exports = router;
