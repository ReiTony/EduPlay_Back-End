const Teacher = require("../models/teacherSchema");
const Token = require("../models/tokenSchema");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerification,
  sendResetPassword,
  createHash,
} = require("../utils");
const crypto = require("crypto");

const currentTeacher = async (req, res) => {
  res.status(StatusCodes.OK).json({ teacher: req.teacher });
};

const teacherRegister = async (req, res) => {
  try {
    const { email, name, password, username, gradeLevel, lrn } = req.body;

    const emailAlreadyExists = await Teacher.findOne({ email });
    if (emailAlreadyExists) {
      throw new CustomError.BadRequestError("Email already exists");
    }

    const verificationToken = crypto.randomBytes(40).toString("hex");

    const teacher = await Teacher.create({
      name,
      email,
      password,
      username,
      gradeLevel,
      lrn,
      verificationToken,
    });
    const origin = "http://localhost:5173";

    await sendVerification({
      name: teacher.name,
      email: teacher.email,
      verificationToken: teacher.verificationToken,
      origin,
    });

    res.status(StatusCodes.CREATED).json({
      msg: "Success! Please check your email to verify account",
    });
  } catch (error) {
    console.error(error); // Log the error to the console
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const teacherVerifyEmail = async (req, res) => {
  try {
    const { verificationToken, email } = req.body;
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      throw new CustomError.UnauthenticatedError("Verification Failed");
    }

    if (teacher.verificationToken !== verificationToken) {
      throw new CustomError.UnauthenticatedError("Verification Failed");
    }

    teacher.isVerified = true;
    teacher.verified = Date.now();
    teacher.verificationToken = "";

    await teacher.save();

    res.status(StatusCodes.OK).json({ msg: "Email Verified" });
  } catch (error) {
    console.error(error); // Log the error to the console
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const teacherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError.BadRequestError(
        "Please provide email and password"
      );
    }

    const userAgent = req.headers["teacher-agent"];
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }
    const isPasswordCorrect = await teacher.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }
    if (!teacher.isVerified) {
      throw new CustomError.UnauthenticatedError("Please verify your email");
    }

    const tokenTeacher = createTokenUser(teacher, userAgent, teacher.gradeLevel);

    let refreshToken = "";

    const existingToken = await Token.findOne({ teacher: teacher._id });

    if (existingToken) {
      const { isValid } = existingToken;
      if (!isValid) {
        throw new CustomError.UnauthenticatedError("Invalid Credentials");
      }
      refreshToken = existingToken.refreshToken;
      attachCookiesToResponse({ res, teacher: tokenTeacher, refreshToken });
      res.status(StatusCodes.OK).json({ teacher: tokenTeacher });
      return;
    }

    refreshToken = crypto.randomBytes(40).toString("hex");
    const ip = req.ip;
    const teacherToken = {
      refreshToken,
      ip,
      userAgent,
      user: teacher._id,
      userModel: "Teacher"
    };

    await Token.create(teacherToken);
    attachCookiesToResponse({ res, teacher: tokenTeacher, refreshToken });

    res.status(StatusCodes.OK).json({ teacher: tokenTeacher });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const teacherLogout = async (req, res) => {
  await Token.findOneAndDelete({ teacher: req.teacher.teacherId });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "teacher logged out!" });
};

const teacherForgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError("Please provide valid email");
  }

  const teacher = await Teacher.findOne({ email });

  if (teacher) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    const origin = "http://localhost:5173";
    await sendResetPassword({
      name: teacher.name,
      email: teacher.email,
      token: passwordToken,
      origin,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    teacher.passwordToken = createHash(passwordToken);
    teacher.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await teacher.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for reset password link" });
};
const teacherResetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const teacher = await Teacher.findOne({ email });

  if (teacher) {
    const currentDate = new Date();

    if (
      teacher.passwordToken === createHash(token) &&
      teacher.passwordTokenExpirationDate > currentDate
    ) {
      teacher.password = password;
      teacher.passwordToken = null;
      teacher.passwordTokenExpirationDate = null;
      await teacher.save();
    }
  }

  res.send("reset password");
};
module.exports = {
  teacherRegister,
  teacherLogin,
  teacherLogout,
  teacherVerifyEmail,
  teacherForgotPassword,
  teacherResetPassword,
  currentTeacher,
};
