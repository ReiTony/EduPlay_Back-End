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
} = require("../controllers/studentController");
const {
  currentTeacher,
  teacherRegister,
  teacherLogin,
  teacherLogout,
  teacherVerifyEmail,
  teacherForgotPassword,
  teacherResetPassword,
} = require("../controllers/teacherController");
const { getClass } = require("../controllers/classController");
const {
  createAssessment,
  updateAssessment,
  deleteAssessment,
  getAllAssessments,
  getSingleAssessment,
} = require("../controllers/assessmentController");
//Teacher
router.get("/", authenticateUser, currentTeacher);
router.post("/register", teacherRegister);
router.post("/login", teacherLogin);
router.delete("/logout", teacherLogout);
router.post("/verify-email", teacherVerifyEmail);
router.post("/reset-password", teacherResetPassword);
router.post("/forgot-password", teacherForgotPassword);
//Teacher Manages Student Account with same GradeLevel
router.get(
  "/Class",
  //authenticateUser,
  //authorizePermissions("teacher"),
  getAllStudents
);
router.post("/addStudent", studentRegister);
router.get("/showStudent/:id", getSingleStudent);
router.patch("/updateStudent/:id", updateStudent);
router.delete("/deleteStudent/:id", authenticateUser, deleteStudent);
//Teacher Manages Assessments
router.get("/assessment", getAllAssessments);
router.get("/assessment/:id", getSingleAssessment);
router.post("/assessment", createAssessment);
router.patch("/assessment/:id", updateAssessment);
router.delete("/assessment/:id", deleteAssessment);

module.exports = router;
