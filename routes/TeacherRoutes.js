const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  studentRegister,
  getSingleStudent,
  updateStudent,
  deleteStudent,
  getAllStudents,
  disableStudent,
  enableStudent,
} = require("../controllers/studentController");
const {
  currentTeacher,
  teacherRegister,
  teacherLogin,
  teacherLogout,
  teacherVerifyEmail,
  teacherResetPassword,
  teacherForgotPassword
} = require("../controllers/teacherController");
const {
  createAssessment,
  updateAssessment,
  deleteAssessment,
  getAllAssessments,
  getSingleAssessment,
} = require("../controllers/assessmentController");
const {
  getProgressReports,
  getProgressReportByStudent,
  updateProgressReport,
} = require("../controllers/progressReportController");
const { getCustomAssessmentAnalysis } = require("../controllers/customAssessmentRecordController");

// Teacher
router.get("/", authenticateUser, currentTeacher);
router.post("/register", teacherRegister);
router.post("/login", teacherLogin);
router.delete("/logout", authenticateUser, teacherLogout);
router.post("/verify-email", teacherVerifyEmail);
router.post("/reset-password", teacherResetPassword);
router.post("/forgot-password", teacherForgotPassword);

// Teacher Manages Student Account with same GradeLevel
router.get("/Class", getAllStudents);
router.post("/addStudent", studentRegister);
router.get("/showStudent/:id", getSingleStudent);
router.patch("/updateStudent/:id", updateStudent);
router.delete("/deleteStudent/:id", deleteStudent);
router.put("/disableStudent/:username", disableStudent);
router.put("/enableStudent/:username", enableStudent);
// Custom Assessment
router.get("/custom-assessment", getCustomAssessmentAnalysis);

// Teacher Manages Assessments
router.get("/assessments", getAllAssessments);
router.get("/getAssessment/:assessmentId", getSingleAssessment);
router.post("/createAssessment", createAssessment);
router.patch("/updateAssessment/:assessmentId", updateAssessment);
router.delete("/deleteAssessment/:assessmentId", deleteAssessment);

// Progress Reports
router.get("/progress-reports", getProgressReports);
router.get("/progress-report/:username", getProgressReportByStudent);
router.put("/progress-report/:id", updateProgressReport);

module.exports = router;
