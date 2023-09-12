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
  deleteTeacher,
} = require("../controllers/manageTeach");

//Admin
router.post("/Admin/register", adminRegister);
router.post("/Admin/login", adminLogin);
router.delete("/Admin/logout", authenticateUser, adminLogout);
router.post("/Admin/verify-email", adminVerifyEmail);
router.post("/Admin/reset-password", adminResetPassword);
router.post("/Admin/forgot-password", adminForgotPassword);
//Admin Manages Teacher Account
router.get(
  "/Admin",
  authenticateUser,
  authorizePermissions("admin"),
  getAllTeachers
);
router.get("/Admin/showTeacher", authenticateUser, showCurrentTeacher);
router.get("/Admin/showTeacher/:id", authenticateUser, getSingleTeacher);
router.patch("/Admin/updateTeacher/:id", authenticateUser, updateTeacher);
router.patch(
  "/Admin/updateTeacherPassword/:id",
  authenticateUser,
  updateTeacherPassword
);
router.delete("/Admin/deleteTeacher/:id", authenticateUser, deleteTeacher);

//Teacher
router.post("/Teacher/register", teacherRegister);
router.post("/Teacher/login", teacherLogin);
router.delete("/Teacher/logout", authenticateUser, teacherLogout);
router.post("/Teacher/verify-email", teacherVerifyEmail);
router.post("/Teacher/reset-password", teacherResetPassword);
router.post("/Teacher/forgot-password", teacherForgotPassword);
//Teacher Manages Student Account
router.get(
  "/Teacher",
  authenticateUser,
  authorizePermissions("teacher"),
  getAllStudents
);
router.get("/Teacher/showStudent", authenticateUser, showCurrentStudent);
router.get("/Teacher/showStudent/:id", authenticateUser, getSingleStudent);
router.patch("/Teacher/updateStudent/:id", authenticateUser, updateStudent);
router.delete("/Teacher/deleteStudent/:id", authenticateUser, deleteStudent);

//Student
router.post("/Student/register", studentRegister);
router.post("/Student/login", studentLogin);
router.delete("/Student/logout", authenticateUser, studentLogout);

module.exports = router;
