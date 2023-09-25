const Student = require("../models/studentSchema");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const getClass = async (req, res) => {
  try {
    const teacherGradeLevel = req.teacher.gradeLevel;

    const students = await Student.find({
      studentGradeLevel: teacherGradeLevel,
    }).select("-password");

    if (students.length > 0) {
      res.send(students);
    } else {
      res.send({
        message: "No students found in the same grade level as the teacher",
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};


module.exports = {
  getClass,
};
