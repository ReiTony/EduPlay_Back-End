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

const {
  storeModule,
  getModules,
  getSingleModule,
  getModulesByGradeLevel,
} = require("../controllers/fileController");

const {
  getAllTeachers,
  getSingleTeacher,
  updateTeacher,
  updateTeacherPassword,
  deleteTeacher,
  teacherRegister,
} = require("../controllers/teacherController");

// Admin
router.get("/", currentAdmin);
router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.delete("/logout", adminLogout);
router.post("/reset-password", adminResetPassword);

// Admin Manages Teachers
router.get("/teachers", getAllTeachers);
router.post("/addTeacher", teacherRegister);
router.get("/showTeacher/:id", getSingleTeacher);
router.patch("/updateTeacher/:id", updateTeacher);  
router.patch("/updateTeacherPassword/:id", updateTeacherPassword);
router.delete("/deleteTeacher/:id", deleteTeacher);

// Admin Manages Students
router.get("/students", getAllStudents);
router.post("/addStudent", studentRegister);
router.get("/showStudent/:id", getSingleStudent);
router.patch("/updateStudent/:id", updateStudent);
router.delete("/deleteStudent/:id", deleteStudent);

// Admin Manages Modules
router.post("/modules", storeModule);
router.get("/modules", getModules);
router.get("/module/:id", getSingleModule);
router.get("/modules/:gradeLevel", getModulesByGradeLevel);

module.exports = router;
