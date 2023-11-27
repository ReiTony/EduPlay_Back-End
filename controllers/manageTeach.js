const Teacher = require('../models/teacherSchema');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  createTokenUser,
  attachCookiesToResponse,
} = require('../utils');

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ role: 'Teacher' });
    res.status(StatusCodes.OK).json({ teachers });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'An error occurred while processing your request.',
    });
  }
};

const getSingleTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.params.id });
    if (!teacher) {
      throw new CustomError.NotFoundError(`No teacher with id : ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({ teacher });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'An error occurred while processing your request.',
    });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { email, username, name } = req.body;
    if (!email || !username) {
      throw new CustomError.BadRequestError('Please provide all values');
    }
    const teacher = await Teacher.findOne({ _id: req.teacher.teacherId });

    teacher.email = email;
    teacher.username = username;
    teacher.name = name;

    await teacher.save();

    const tokenTeacher = createTokenUser(teacher);
    attachCookiesToResponse({ res, user: tokenTeacher });
    res.status(StatusCodes.OK).json({ teacher: tokenTeacher });
  } catch (error) {
    if (error instanceof CustomError.BadRequestError) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    } else if (error instanceof CustomError.NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    } else {
      console.error('An error occurred:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Internal server error',
      });
    }
  }
};

const updateTeacherPassword = async (req, res) => {
  try {
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
  } catch (error) {
    if (error instanceof CustomError.BadRequestError) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    } else if (error instanceof CustomError.UnauthenticatedError) {
      res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
    } else {
      console.error('An error occurred:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Internal server error',
      });
    }
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    if (!teacherId) {
      throw new CustomError.BadRequestError('Please provide a valid teacher ID');
    }
    const teacher = await Teacher.findOne({ _id: teacherId });

    if (!teacher) {
      throw new CustomError.NotFoundError('Teacher not found');
    }

    await teacher.remove();

    res.status(StatusCodes.OK).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    if (error instanceof CustomError.BadRequestError) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    } else if (error instanceof CustomError.NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    } else {
      console.error('An error occurred:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Internal server error',
      });
    }
  }
};

module.exports = {
  getAllTeachers,
  getSingleTeacher,
  updateTeacher,
  updateTeacherPassword,
  deleteTeacher,
};
