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
  recordModuleProgress,
  recordGameScore,
} = require("../controllers/recordController");
const { getStudentModule, getSummary } = require("../controllers/moduleController");
const { createAssessmentRecord } = require("../controllers/assessmentRecordsController");
const { getAllAssessments } = require("../controllers/assessmentController");
const { createCustomAssessmentRecord } = require("../controllers/customAssessmentRecordController");

// Student
router.get("/assessment", getAllAssessments)
router.get("/module", getStudentModule)
router.get("/module-summary", getSummary)
router.post("/assessment-record", createAssessmentRecord);
router.post("/custom-assessment-record", createCustomAssessmentRecord)
router.get("/:id", showCurrentStudent);
router.post("/login", studentLogin);
router.delete("/logout", authenticateUser, studentLogout);

// Record
router.post("/assessment/:assessmentId", recordAssessmentScore);
router.post("/module/:moduleId", recordModuleProgress);
router.post("/game-score", recordGameScore);

module.exports = router;
