const Student = require("../models/studentSchema");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");

const getAllStudents = async (req, res) => {
  console.log(req.student);
  const students = await Student.find({ role: "student" });
  res.status(StatusCodes.OK).json({ students });
};

const getSingleStudent = async (req, res) => {
  const student = await Student.findOne({ _id: req.params.id });
  if (!student) {
    throw new CustomError.NotFoundError(
      `No student with id : ${req.params.id}`
    );
  }
  checkPermissions(req.student, student._id);
  res.status(StatusCodes.OK).json({ student });
};

const showCurrentStudent = async (req, res) => {
  res.status(StatusCodes.OK).json({ student: req.student });
};

const updateStudent = async (req, res) => {
  const { lastName, firstName } = req.body;
  if (!lastName || !firstName) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const student = await Student.findOne({ _id: req.student.studentId });

  student.lastName = lastName;
  student.firstName = firstName;

  await student.save();

  const tokenStudent = createTokenUser(student);
  attachCookiesToResponse({ res, student: tokenStudent });
  res.status(StatusCodes.OK).json({ student: tokenStudent });
};

const deleteStudent = async (req, res) => {
  const studentId = req.params.studentId;

  if (!studentId) {
    throw new CustomError.BadRequestError("Please provide a valid student ID");
  }
  const student = await Student.findOne({ _id: studentId });

  if (!student) {
    throw new CustomError.NotFoundError("Student not found");
  }

  await student.remove();

  res.status(StatusCodes.OK).json({ message: "Student deleted successfully" });
};

module.exports = {
  getAllStudents,
  getSingleStudent,
  showCurrentStudent,
  updateStudent,
  deleteStudent,
};
