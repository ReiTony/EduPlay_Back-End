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
    const { email, name, password, gradeLevel} = req.body;

    const emailAlreadyExists = await Teacher.findOne({ email });
    if (emailAlreadyExists) {
      throw new CustomError.BadRequestError("Email already exists");
    }

    const verificationToken = crypto.randomBytes(40).toString("hex");

    const teacher = await Teacher.create({
      name,
      email,
      password,
      gradeLevel,
      verificationToken,
    });
    const origin = "https://eduplay-lhjs.onrender.com";

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

    const tokenTeacher = createTokenUser(teacher);

    let refreshToken = "";

    const existingToken = await Token.findOne({ user: teacher._id });

    if (existingToken) {
      const { isValid } = existingToken;
      if (!isValid) {
        throw new CustomError.UnauthenticatedError("Invalid Credentials");
      }
      refreshToken = existingToken.refreshToken;
      attachCookiesToResponse({ res, user: tokenTeacher, refreshToken });
      res.status(StatusCodes.OK).json({ user: tokenTeacher });
      return;
    }

    refreshToken = crypto.randomBytes(40).toString("hex");
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const teacherToken = {
      refreshToken,
      ip,
      userAgent,
      gradeLevel: teacher.gradeLevel,
      user: teacher._id,
      userModel: "Teacher",
    };

    await Token.create(teacherToken);
    attachCookiesToResponse({ res, user: tokenTeacher, refreshToken });

    res.status(StatusCodes.OK).json({ user: tokenTeacher });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const teacherLogout = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new CustomError.UnauthenticatedError("User not authenticated");
    }

    console.log("User object:", req.user);
    //console.log('User ID:', req.user.user.userId);
    const tokenToDelete = req.user.user.userId;
    const deletedToken = await Token.findOneAndDelete({ user: tokenToDelete });

    if (!deletedToken) {
      console.log("Token not found");
    } else {
      console.log("Deleted token:", deletedToken);
      console.log("Token deleted successfully");
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    console.log("Cookies cleared successfully");

    res.status(StatusCodes.OK).json({ msg: "Teacher logged out!" });
  } catch (error) {
    console.error("Error during teacher logout:", error);
    next(error);
  }
};

const teacherForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new CustomError.BadRequestError("Please provide a valid email");
    }

    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      throw new CustomError.NotFoundError("Teacher not found");
    }

    const passwordToken = crypto.randomBytes(70).toString("hex");
    const origin = "https://eduplay-lhjs.onrender.com";

    await sendResetPassword({
      teacher,
      token: passwordToken,
      origin,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    teacher.passwordToken = createHash(passwordToken);
    teacher.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await teacher.save();

    res
      .status(StatusCodes.OK)
      .json({ msg: "Please check your email for the reset password link" });
  } catch (error) {
    console.error("Error in teacherForgotPassword:", error);

    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error",
      });
    }
  }
};

const teacherResetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new CustomError.BadRequestError("Please provide the email");
    }

    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      throw new CustomError.NotFoundError("Teacher not found");
    }

    const newPassword = req.body.newPassword;
    if (!newPassword) {
      throw new CustomError.BadRequestError("Please provide the new password");
    }
    teacher.password = newPassword;
    await teacher.save();

    res.send("Password Reset Successfully");
  } catch (error) {
    console.error("Error in teacherResetPassword:", error);

    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error",
      });
    }
  }
};

// const teacherResetPassword = async (req, res) => {
//   const { email } = req.body;
//   if (!email ) {
//     throw new CustomError.BadRequestError("Please provide all values");
//   }
//   const teacher = await Teacher.findOne({ email });

//   if (teacher) {
//     const currentDate = new Date();

//     if (
//       teacher.passwordToken === createHash(token) &&
//       teacher.passwordTokenExpirationDate > currentDate
//     ) {
//       teacher.password = password;
//       teacher.passwordToken = null;
//       teacher.passwordTokenExpirationDate = null;
//       await teacher.save();
//     }
//   }

//   res.send("Password Reset Successfully");
// };

// Manage Teacher For Admin

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ role: "Teacher" });
    res.status(StatusCodes.OK).json({ teachers });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while processing your request.",
    });
  }
};

const getSingleTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.params.id });
    if (!teacher) {
      throw new CustomError.NotFoundError(
        `No teacher with id : ${req.params.id}`
      );
    }
    res.status(StatusCodes.OK).json({ teacher });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while processing your request.",
    });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) {
      throw new CustomError.BadRequestError("Please provide all values");
    }
    const teacher = await Teacher.findOne({ _id: req.params.id });

    if (!teacher) {
      throw new CustomError.NotFoundError(
        `Teacher doesn't exists: ${req.params.id}`
      );
    }

    teacher.email = email;
    teacher.name = name;

    await teacher.save();

    const tokenTeacher = createTokenUser(teacher);
    attachCookiesToResponse({ res, user: tokenTeacher });
    res.status(StatusCodes.OK).json({ user: tokenTeacher });
  } catch (error) {
    if (error instanceof CustomError.BadRequestError) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    } else if (error instanceof CustomError.NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    } else {
      console.error("An error occurred:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal server error",
      });
    }
  }
};

const updateTeacherPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new CustomError.BadRequestError("Please provide both values");
    }
    const teacher = await Teacher.findOne({ _id: req.params.id });

    const isPasswordCorrect = await teacher.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }
    teacher.password = newPassword;

    await teacher.save();
    res.status(StatusCodes.OK).json({ msg: "Success! Password Updated." });
  } catch (error) {
    if (error instanceof CustomError.BadRequestError) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    } else if (error instanceof CustomError.UnauthenticatedError) {
      res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
    } else {
      console.error("An error occurred:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal server error",
      });
    }
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOneAndDelete({ _id: req.params.id });

    if (!teacher) {
      throw new CustomError.NotFoundError("Teacher not found");
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Teacher deleted successfully" });
  } catch (error) {
    if (error instanceof CustomError.NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    } else {
      console.error("An error occurred:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal server error",
      });
    }
  }
};


module.exports = {
  teacherRegister,
  teacherLogin,
  teacherLogout,
  teacherVerifyEmail,
  teacherForgotPassword,
  teacherResetPassword,
  currentTeacher,
  getAllTeachers,
  getSingleTeacher,
  updateTeacher,
  updateTeacherPassword,
  deleteTeacher,
};
