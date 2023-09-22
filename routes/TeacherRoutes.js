const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  studentRegister,
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
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

//Teacher
router.get("/", authenticateUser, currentTeacher);
router.post("/register", teacherRegister);
router.post("/login", teacherLogin);
router.delete("/logout", authenticateUser, teacherLogout);
router.post("/verify-email", teacherVerifyEmail);
router.post("/reset-password", teacherResetPassword);
router.post("/forgot-password", teacherForgotPassword);
//Teacher Manages Student Account
router.get(
  "/Manage-Students",
  authenticateUser,
  authorizePermissions("teacher"),
  getAllStudents
);
router.post("/addStudent", studentRegister);
router.get("/showStudent/:id", authenticateUser, getSingleStudent);
router.patch("/updateStudent/:id", authenticateUser, updateStudent);
router.delete("/deleteStudent/:id", authenticateUser, deleteStudent);

module.exports = router;
