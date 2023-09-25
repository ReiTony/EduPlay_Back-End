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
const {
  getClass
} = require("../controllers/classController")
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
  getClass
);
router.post("/addStudent", studentRegister);
router.get("/showStudent/:id",  getSingleStudent);
router.patch("/updateStudent/:id",  updateStudent);
router.delete("/deleteStudent/:id", authenticateUser, deleteStudent);

module.exports = router;