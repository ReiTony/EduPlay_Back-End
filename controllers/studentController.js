const Student = require("../models/studentSchema");
const ProgressReport = require("../models/progressReportsSchema");
const Token = require("../models/tokenSchema");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");
const crypto = require("crypto");
const AssessmentRecord = require("../models/assessmentRecordsSchema");
const Notification = require("../models/notificationSchema");

const studentRegister = async (req, res) => {
  try {
    const { lastName, firstName, birthMonth, birthDay, gradeLevel } = req.body;
    const username = `${lastName}${firstName}`.replace(/\s/g, "");
    const password = `${birthMonth}${birthDay}`;
    const verificationToken = crypto.randomBytes(40).toString("hex");

    const newStudent = new Student({
      firstName,
      lastName,
      birthDay,
      birthMonth,
      gradeLevel,
      username,
      password,
      verificationToken,
    });

    const newProgressReport = new ProgressReport({
      username: newStudent.username,
    });

    await newProgressReport.save();
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

    if (!username || !password) {
      throw new CustomError.BadRequestError(
        "Please provide username and password"
      );
    }
    const student = await Student.findOne({
      username: { $regex: new RegExp(username, "i") },
    });

    if (!student) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }

    if (!student.isActive) {
      throw new CustomError.UnauthenticatedError("Account is disabled");
    }

    // Check if the entered password is correct
    const isPasswordCorrect = await student.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }

    const tokenStudent = createTokenUser(student);

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
    const userAgent = req.headers["user-agent"];
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
    if (
      error instanceof CustomError.UnauthenticatedError ||
      error instanceof CustomError.BadRequestError
    ) {
      res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  }
};

const studentLogout = async (req, res, next) => {
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

    res.status(StatusCodes.OK).json({ msg: "Student logged out!" });
  } catch (error) {
    console.error("Error during student logout:", error);
    next(error);
  }
};

const getAllStudents = async (req, res) => {
  console.log(req.student);
  const students = await Student.find({ role: "Student" });
  res.status(StatusCodes.OK).json({ students });
};

const getSingleStudent = async (req, res) => {
  try {
    const student = await Student.findOne({ username: req.params.id });
    //const { firstName, lastName } = req.query;
    //const student = await Student.findOne({ firstName, lastName });

    if (!student) {
      throw new CustomError.NotFoundError(
        //`No student with firstName: ${firstName} and lastName: ${lastName}`
        `No student with username : ${req.params.id}`
      );
    }

    res.status(StatusCodes.OK).json({ student });
  } catch (error) {
    console.error(error); // Log the error to the console
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const showCurrentStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId).lean();

    if (!student) {
      throw new CustomError.NotFoundError(`No student with id: ${studentId}`);
    }

    const gradeLevel = student.gradeLevel;
    const recipient = studentId;
    //console.log(`Grade Level: ${gradeLevel}`);
    //console.log(`Recipient: ${recipient}`)

    const assessmentRecords = await AssessmentRecord.find({
      studentId: studentId,
    });
    const notifications = await Notification.find({
      $or: [{ recipient: recipient }, { gradeLevel: gradeLevel }],
    })
      .sort({ createdAt: -1 })
      .limit(10);

    console.log(`Notifications:`, notifications);

    res
      .status(StatusCodes.OK)
      .json({ ...student, assessmentRecords, notifications });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { lastName, firstName, gradeLevel, birthDay, birthMonth } = req.body;
    const username = `${lastName}${firstName}`;
    const password = `${birthMonth}${birthDay}`;

    if (!lastName || !firstName) {
      throw new CustomError.BadRequestError("Please provide all values");
    }

    const student = await Student.findOne({ username: req.params.id });

    if (!student) {
      throw new CustomError.NotFoundError(
        `No student with username: ${req.params.id}`
      );
    }

    // student info
    student.lastName = lastName;
    student.firstName = firstName;
    student.gradeLevel = gradeLevel;
    student.birthDay = birthDay;
    student.birthMonth = birthMonth;
    student.password = password;
    student.username = username;

    await student.save();

    const progressReport = await ProgressReport.findOne({
      username: req.params.id,
    });

    if (!progressReport) {
      throw new CustomError.NotFoundError(
        `No progress report found for username: ${req.params.id}`
      );
    }

    progressReport.username = username;

    await progressReport.save();

    const tokenStudent = createTokenUser(student);
    attachCookiesToResponse({ res, student: tokenStudent });

    res.status(StatusCodes.OK).json({ student: tokenStudent, student });
  } catch (error) {
    if (error instanceof CustomError.BadRequestError) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    } else if (error instanceof CustomError.NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    } else {
      console.error("An error occurred:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  }
};

const deleteStudent = async (req, res) => {
  try {
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

    const progressReport = await ProgressReport.findOneAndDelete({
      username: username,
    });

    if (!progressReport) {
      console.log(`Progress report not found for username: ${username}`);
    } else {
      console.log(`Deleted progress report for username: ${username}`);
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Student deleted successfully" });
  } catch (error) {
    if (error instanceof CustomError.BadRequestError) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    } else if (error instanceof CustomError.NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    } else {
      console.error("An error occurred:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  }
};

const disableStudent = async (req, res) => {
  try {
    const { username } = req.params;

    const student = await Student.findOneAndUpdate(
      { username },
      { isActive: false },
      { new: true }
    );

    if (!student) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `Student with username "${username}" not found` });
    }

    res
      .status(StatusCodes.OK)
      .json({
        message: `Student account for ${username} disabled successfully`,
      });
  } catch (error) {
    console.error("Error disabling student account:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const enableStudent = async (req, res) => {
  try {
    const { username } = req.params;

    const student = await Student.findOneAndUpdate(
      { username },
      { isActive: true },
      { new: true }
    );

    if (!student) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `Student with username "${username}" not found` });
    }

    res
      .status(StatusCodes.OK)
      .json({
        message: `Student account for ${username} enabled successfully`,
      });
  } catch (error) {
    console.error("Error enabling student account:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
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
  disableStudent,
  enableStudent,
};
