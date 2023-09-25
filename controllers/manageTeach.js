const Teacher = require('../models/teacherSchema');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require('../utils');

const getAllTeachers = async (req, res) => {
  console.log(req.teacher);
  const teacher = await Teacher.find({ role: 'Teacher' });
  res.status(StatusCodes.OK).json({ teachers });
};

const getSingleTeacher = async (req, res) => {
  const teacher = await Teacher.findOne({ _id: req.params.id });
  if (!teacher) {
    throw new CustomError.NotFoundError(`No teacher with id : ${req.params.id}`);
  }
  checkPermissions(req.teacher, teacher._id);
  res.status(StatusCodes.OK).json({ teacher });
};


const updateTeacher = async (req, res) => {
  const { email, username, name} = req.body;
  if (!email || username) {
    throw new CustomError.BadRequestError('Please provide all values');
  }
  const teacher = await Teacher.findOne({ _id: req.teacher.teacherId });
  
  teacher.email = email;
  teacher.username = username;
  teacher.name = name;

  await teacher.save();

  const tokenTeacher = createTokenUser(teacher);
  attachCookiesToResponse({ res, teacher: tokenTeacher });
  res.status(StatusCodes.OK).json({ teacher: tokenTeacher });
};
const updateTeacherPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('Please provide both values');
  }
  const teacher = await Teacher.findOne({ _id: req.teacher.teacherId });

  const isPasswordCorrect = await teacher.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  teacher.password = newPassword;

  await teacher.save();
  res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
};

const deleteTeacher = async (req, res) => {
  const teacherLrn = req.params.teacherLrn;

  if (!teacherLrn) {
    throw new CustomError.BadRequestError("Please provide a valid teacher LRN");
  }
  const teacher = await Teacher.findOne({ _lrn: studentId });

  if (!teacher) {
    throw new CustomError.NotFoundError("Teacher not found");
  }

  await teacher.remove();

  res.status(StatusCodes.OK).json({ message: "Teacher deleted successfully" });
};

module.exports = {
  getAllTeachers,
  getSingleTeacher,
  updateTeacher,
  updateTeacherPassword,
  deleteTeacher,
};
