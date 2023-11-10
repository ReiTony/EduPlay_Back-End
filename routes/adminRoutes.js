const express = require("express");
const router = express.Router();

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
} = require("../controllers/adminController");

const {
  getAllTeachers,
  getSingleTeacher,
  updateTeacher,
  updateTeacherPassword,
  deleteTeacher,
} = require("../controllers/manageTeach");

const {
  studentRegister,
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const { uploadModules } = require("../controllers/moduleController"); // Import the moduleController

// Admin
router.get("/", authenticateUser, showCurrentAdmin);
router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.delete("/logout", authenticateUser, adminLogout);
router.post("/verify-email", adminVerifyEmail);
router.post("/reset-password", adminResetPassword);
router.post("/forgot-password", adminForgotPassword);

// Admin Manages Teacher Account
router.get(
  "/Manage-Teachers",
  // authenticateUser,
  // authorizePermissions("admin"),
  getAllTeachers
);
router.get(
  "/showTeacher/:id",
  // authenticateUser,
  getSingleTeacher
);
router.patch(
  "/updateTeacher/:id",
  // authenticateUser,
  updateTeacher
);
router.patch(
  "/updateTeacherPassword/:id",
  // authenticateUser,
  updateTeacherPassword
);
router.delete("/deleteTeacher/:id", authenticateUser, deleteTeacher);

// Admin Manages Student Account
router.get(
  "/Manage-Students",
  // authenticateUser,
  // authorizePermissions("admin"),
  getAllStudents
);
router.post("/addStudent", studentRegister);
router.get("/showStudent/:id", getSingleStudent);
router.patch("/updateStudent/:id", updateStudent);
router.delete("/deleteStudent/:id", deleteStudent);

// Admin Uploads Modules
router.get("/uploadModules", async (req, res) => {
  const folderPath = "../data/modules/grade1/module1"; 
  try {
    await uploadModules(folderPath);
    res.send("Modules uploaded to the database.");
  } catch (error) {
    res
      .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error.message);
  }
});

module.exports = router;
