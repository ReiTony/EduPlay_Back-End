const Student = require("../models/studentSchema");
const Token = require("../models/tokenSchema");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
} = require("../utils");
const crypto = require("crypto");

const studentRegister = async (req, res) => {
  try {
    const { lastName, firstName, birthMonth, birthDay, gradeLevel } = req.body;
    const username = `${lastName}${firstName}`;
    const password = `${birthMonth}${birthDay}`;
    const verificationToken = crypto.randomBytes(40).toString("hex");

    // Calculate studentId based on the current number of registered students
    const studentCount = await Student.countDocuments({});
    const studentId = studentCount + 1;

    const newStudent = new Student({
      studentId,
      firstName,
      lastName,
      birthDay,
      birthMonth,
      gradeLevel,
      username,
      password,
      verificationToken,
    });

    await newStudent.save();

    res.status(StatusCodes.CREATED).json({
      msg: "Success! Student Created",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while processing your request.",
    });
  }
};

const studentLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userAgent = req.headers["student-agent"];

    if (!username || !password) {
      throw new CustomError.BadRequestError(
        "Please provide email and password"
      );
    }

    const student = await Student.findOne({ username });

    if (!student) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }

    const isPasswordCorrect = await student.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }

    const tokenStudent = createTokenUser(student, userAgent);

    let refreshToken = "";

    const existingToken = await Token.findOne({ user: student._id });

    if (existingToken) {
      const { isValid } = existingToken;
      if (!isValid) {
        throw new CustomError.UnauthenticatedError("Invalid Credentials");
      }
      refreshToken = existingToken.refreshToken;
      attachCookiesToResponse({ res, user: tokenStudent, refreshToken });
      res.status(StatusCodes.OK).json({ user: tokenStudent });
      return;
    }

    refreshToken = crypto.randomBytes(40).toString("hex");
    const ip = req.ip;
    const studentToken = {
      refreshToken,
      ip,
      userAgent,
      user: student._id,
      userModel: "Student",
    };

    await Token.create(studentToken);

    attachCookiesToResponse({ res, user: tokenStudent, refreshToken });

    res.status(StatusCodes.OK).json({ user: tokenStudent });
  } catch (error) {
    // Log the error to the console
    console.error("An error occurred:", error);

    // Send an error response to the frontend
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const studentLogout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.student._id });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "student logged out!" });
};

const getAllStudents = async (req, res) => {
  console.log(req.student);
  const students = await Student.find({ role: "Student" });
  res.status(StatusCodes.OK).json({ students });
};

const getSingleStudent = async (req, res) => {
  try {
    const student = await Student.findOne({ username: req.params.id });
    //console.log('req.teacher:', req.teacher);
    if (!student) {
      throw new CustomError.NotFoundError(
        `No student with username : ${req.params.id}`
      );
    }
    //checkPermissions(req.teacher, student._id);
    res.status(StatusCodes.OK).json({ student });
  } catch (error) {
    console.error(error); // Log the error to the console
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const showCurrentStudent = async (req, res) => {
  res.status(StatusCodes.OK).json({ student: req.student });
};

const updateStudent = async (req, res) => {
  const { lastName, firstName } = req.body;
  const username = `${lastName}-${firstName}`;
  if (!lastName || !firstName) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const student = await Student.findOne({ username: req.params.id });

  if (!student) {
    throw new CustomError.NotFoundError(
      `No student with username : ${req.params.id}`
    );
  }

  student.lastName = lastName;
  student.firstName = firstName;
  student.username = username;
  await student.save();

  const tokenStudent = createTokenUser(student);
  attachCookiesToResponse({ res, student: tokenStudent });
  res.status(StatusCodes.OK).json({ student: tokenStudent, student });
};

const deleteStudent = async (req, res) => {
  const username = req.params.id;
  if (!username) {
    throw new CustomError.BadRequestError("Please provide a valid username");
  }
  const student = await Student.findOneAndDelete({ username });
  if (!student) {
    throw new CustomError.NotFoundError(
      `Student with username "${username}" not found`
    );
  }

  res.status(StatusCodes.OK).json({ message: "Student deleted successfully" });
};

module.exports = {
  studentRegister,
  studentLogin,
  studentLogout,
  getAllStudents,
  getSingleStudent,
  showCurrentStudent,
  updateStudent,
  deleteStudent,
};
