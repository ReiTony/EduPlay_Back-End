const express = require("express");
const adminRouter = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  adminRegister,
  adminLogin,
  adminLogout,
  adminVerifyEmail,
  adminForgotPassword,
  adminResetPassword,
  showCurrentAdmin,
} = require("../controllers/adminAccount");
const {
  getAllTeachers,
  getSingleTeacher,
  updateTeacher,
  updateTeacherPassword,
  deleteTeacher,
} = require("../controllers/manageTeach");

//Admin
router.get("/", authenticateUser, showCurrentAdmin);
router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.delete("/logout", authenticateUser, adminLogout);
router.post("/verify-email", adminVerifyEmail);
router.post("/reset-password", adminResetPassword);
router.post("/forgot-password", adminForgotPassword);
//Admin Manages Teacher Account
router.get(
  "/Manage-Teachers",
  authenticateUser,
  authorizePermissions("admin"),
  getAllTeachers
);
router.get("/showTeacher/:id", authenticateUser, getSingleTeacher);
router.patch("/updateTeacher/:id", authenticateUser, updateTeacher);
router.patch(
  "/updateTeacherPassword/:id",
  authenticateUser,
  updateTeacherPassword
);
router.delete("/deleteTeacher/:id", authenticateUser, deleteTeacher);

module.exports = adminRouter;
