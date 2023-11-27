const express = require("express");
const router = express.Router();
const {
  adminLogin,
  adminLogout,
  adminRegister,
  adminResetPassword,
  currentAdmin,
} = require("../controllers/adminController");

const {
  deleteStudent,
  updateStudent,
  getAllStudents,
  getSingleStudent,
  studentRegister,
} = require("../controllers/studentController");

// Admin
router.get("/", currentAdmin);
router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.delete("/logout", adminLogout);
router.post("/reset-password", adminResetPassword);

// Admin Manages Students
router.get("/students", getAllStudents);
router.post("/addStudent", studentRegister);
router.get("/showStudent/:id", getSingleStudent);
router.patch("/updateStudent/:id", updateStudent);  
router.delete("/deleteStudent/:id", deleteStudent);

module.exports = router;
