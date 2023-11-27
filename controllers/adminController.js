const Admin = require("../models/adminSchema");
const Token = require("../models/tokenSchema");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  createHash,
} = require("../utils");
const crypto = require("crypto");

const adminRegister = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const emailAlreadyExists = await Admin.findOne({ email });
    if (emailAlreadyExists) {
      throw new CustomError.BadRequestError("Email already exists");
    }

    const newAdmin = new Admin({
      name,
      email,
      password,
    });

    await newAdmin.save();

    res.status(StatusCodes.CREATED).json({
      msg: "Success! Admin registered",
    });
  } catch (error) {
    console.error("An error occurred:", error);
    if (error instanceof CustomError.BadRequestError) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "An internal server error occurred",
      });
    }
  }
};
// const adminVerifyEmail = async (req, res) => {
//   const { verificationToken, email } = req.body;
//   const admin = await Admin.findOne({ email });

//   if (!admin) {
//     throw new CustomError.UnauthenticatedError("Verification Failed");
//   }

//   if (admin.verificationToken !== verificationToken) {
//     throw new CustomError.UnauthenticatedError("Verification Failed");
//   }

//   (admin.isVerified = true), (admin.verified = Date.now());
//   admin.verificationToken = "";

//   await admin.save();

//   res.status(StatusCodes.OK).json({ msg: "Email Verified" });
// };

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError(
      "Please provide username and password"
    );
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await admin.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const tokenAdmin = createTokenUser(admin);

  let refreshToken = "";

  const existingToken = await Token.findOne({ user: admin._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenAdmin, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenAdmin });
    return;
  }
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const adminToken = {
    refreshToken,
    ip,
    userAgent,
    user: admin._id,
    userModel: "Admin",
  };

  await Token.create(adminToken);

  attachCookiesToResponse({ res, user: tokenAdmin, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenAdmin });
};

const adminLogout = async (req, res, next) => {
  try {
    if (!req.admin) {
      throw new CustomError.UnauthenticatedError("Admin not authenticated");
    }

    const tokenToDelete = req.admin._id;
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

    res.status(StatusCodes.OK).json({ msg: "Admin logged out!" });
  } catch (error) {
    console.error("Error during admin logout:", error);
    next(error);
  }
};

const adminResetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new CustomError.BadRequestError("Please provide the email");
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      throw new CustomError.NotFoundError("Admin not found");
    }

    const password = req.body.password;
    if (!password) {
      throw new CustomError.BadRequestError("Please provide the new password");
    }

    admin.password = password;
    await admin.save();

    res.send("Password Reset Successfully");
  } catch (error) {
    console.error("Error in adminResetPassword:", error);

    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error",
      });
    }
  }
};


const currentAdmin = async (req, res) => {
  res.status(StatusCodes.OK).json({ admin: req.admin });
};

module.exports = {
  adminRegister,
  adminLogin,
  adminLogout,
  adminResetPassword,
  currentAdmin,
};
