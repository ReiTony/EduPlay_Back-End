const Student = require('../models/studentSchema')
const Token = require('../models/tokenSchema')
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
} = require("../utils");
const crypto = require("crypto");

const studentRegister = async (req, res) => {
    const { lastName, firstName, birthMonth, birthDay} = req.body;
  
    const existingStudent = await Student.findOne({ username });
    if (existingStudent) {
      throw new CustomError.BadRequestError("User already exists");
    }
  
    const verificationToken = crypto.randomBytes(40).toString("hex");
  
    const newStudent = new Student.create({
      firstName,
      lastName,
      birthDay,
      birthMonth,
      role,
      verificationToken,
    });

    await newStudent.save();

    res.status(StatusCodes.CREATED).json({
      msg: "Success! Student Created",
    });
  };
  
  
  const studentLogin = async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      throw new CustomError.BadRequestError('Please provide email and password');
    }
    const student = await Student.findOne({ username });
  
    if (!student) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    const isPasswordCorrect = await student.comparePassword(password);
  
    if (!isPasswordCorrect) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    const tokenStudent = createTokenUser(student);
  
    // create refresh token
    let refreshToken = '';
    // check for existing token
    const existingToken = await Token.findOne({ student: student._id });
  
    if (existingToken) {
      const { isValid } = existingToken;
      if (!isValid) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
      }
      refreshToken = existingToken.refreshToken;
      attachCookiesToResponse({ res, student: tokenStudent, refreshToken });
      res.status(StatusCodes.OK).json({ student: tokenStudent });
      return;
    }
  
    refreshToken = crypto.randomBytes(40).toString('hex');
    const studentAgent = req.headers['student-agent'];
    const ip = req.ip;
    const studentToken = { refreshToken, ip, studentAgent, student: student._id };
  
    await Token.create(studentToken);
  
    attachCookiesToResponse({ res, student: tokenStudent, refreshToken });
  
    res.status(StatusCodes.OK).json({ student: tokenStudent });
  };
  const studentLogout = async (req, res) => {
    await Token.findOneAndDelete({ student: req.student.studentId });
  
    res.cookie('accessToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.cookie('refreshToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'student logged out!' });
  };
  
 
  module.exports = {
    studentRegister,
    studentLogin,
    studentLogout,
  };
  