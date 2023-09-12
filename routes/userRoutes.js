const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  studentRegister,
  studentLogin,
  studentLogout,
} = require("../controllers/studentAccount");
const {
  teacherRegister,
  teacherLogin,
  teacherLogout,
  teacherVerifyEmail,
  teacherForgotPassword,
  teacherResetPassword,
} = require("../controllers/teacherAccount");
const {
  adminRegister,
  adminLogin,
  adminLogout,
  adminVerifyEmail,
  adminForgotPassword,
  adminResetPassword,
} = require("../controllers/adminAccount");
const {
  getAllStudents,
  getSingleStudent,
  showCurrentStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/manageStud");
const {
  getAllTeachers,
  getSingleTeacher,
  showCurrentTeacher,
  updateTeacher,
  updateTeacherPassword,
} = require("../controllers/manageTeach");

//Admin

//Teacher

//Student
router.post("/register", register);
router.post("/login", login);
router.delete("/logout", authenticateUser, logout);
router.post("/verify-email", verifyEmail);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);

module.exports = router;
