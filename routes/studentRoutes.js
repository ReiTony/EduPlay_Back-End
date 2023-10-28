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
} = require("../controllers/assessmentController");

//Student
router.get("/:id", showCurrentStudent);
router.post("/login", studentLogin);
router.delete("/logout", authenticateUser, studentLogout);
router.post("/assessment", recordAssessmentScore);

module.exports = router;
