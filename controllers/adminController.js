const Admin = require('../models/adminSchema')
const Token = require('../models/tokenSchema')
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

const adminRegister = async (req, res) => {
  const { email, name, password, username } = req.body;

  try {
    const emailAlreadyExists = await Admin.findOne({ email });
    if (emailAlreadyExists) {
      throw new CustomError.BadRequestError("Email already exists");
    }

    const verificationToken = crypto.randomBytes(40).toString("hex");

    const admin = await Admin.create({
      name,
      email,
      password,
      username,
      verificationToken,
    });
    const origin = "http://localhost:3000";

    await sendVerification({
      name: admin.name,
      email: admin.email,
      verificationToken: admin.verificationToken,
      origin,
    });

    res.status(StatusCodes.CREATED).json({
      msg: "Success! Please check your email to verify account",
    });
  } catch (error) {
    // Handle different types of errors here
    console.error("An error occurred:", error);

    // You can customize the response based on the error type
    if (error instanceof CustomError.BadRequestError) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    } else if (error instanceof SomeOtherErrorType) {
      // Handle other specific error types if needed
    } else {
      // Handle generic errors
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "An internal server error occurred",
      });
    }
  }
};
  
  const adminVerifyEmail = async (req, res) => {
    const { verificationToken, email } = req.body;
    const admin = await Admin.findOne({ email });
  
    if (!admin) {
      throw new CustomError.UnauthenticatedError("Verification Failed");
    }
  
    if (admin.verificationToken !== verificationToken) {
      throw new CustomError.UnauthenticatedError("Verification Failed");
    }
  
    (admin.isVerified = true), (admin.verified = Date.now());
    admin.verificationToken = "";
  
    await admin.save();
  
    res.status(StatusCodes.OK).json({ msg: "Email Verified" });
  };
  
  const adminLogin = async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      throw new CustomError.BadRequestError('Please provide username and password');
    }
    const admin = await Admin.findOne({ username });
  
    if (!admin) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    const isPasswordCorrect = await admin.comparePassword(password);
  
    if (!isPasswordCorrect) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    if (!admin.isVerified) {
      throw new CustomError.UnauthenticatedError('Please verify your email');
    }
    const tokenAdmin = createTokenUser(admin);
  
    // create refresh token
    let refreshToken = '';
    // check for existing token
    const existingToken = await Token.findOne({ admin: admin._id });
  
    if (existingToken) {
      const { isValid } = existingToken;
      if (!isValid) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
      }
      refreshToken = existingToken.refreshToken;
      attachCookiesToResponse({ res, admin: tokenAdmin, refreshToken });
      res.status(StatusCodes.OK).json({ admin: tokenAdmin });
      return;
    }
  
    refreshToken = crypto.randomBytes(40).toString('hex');
    const adminAgent = req.headers['admin-agent'];
    const ip = req.ip;
    const adminToken = { refreshToken, ip, adminAgent, admin: admin._id };
  
    await Token.create(adminToken);
  
    attachCookiesToResponse({ res, admin: tokenAdmin, refreshToken });
  
    res.status(StatusCodes.OK).json({ admin: tokenAdmin });
  };
  const adminLogout = async (req, res) => {
    await Token.findOneAndDelete({ admin: req.admin.adminId });
  
    res.cookie('accessToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.cookie('refreshToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'admin logged out!' });
  };
  
  const adminForgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      throw new CustomError.BadRequestError('Please provide valid email');
    }
  
    const admin = await Admin.findOne({ email });
  
    if (admin) {
      const passwordToken = crypto.randomBytes(70).toString('hex');
      const origin = 'http://localhost:3000';
      await sendResetPassword({
        name: admin.name,
        email: admin.email,
        token: passwordToken,
        origin,
      });
  
      const tenMinutes = 1000 * 60 * 10;
      const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
  
      admin.passwordToken = createHash(passwordToken);
      admin.passwordTokenExpirationDate = passwordTokenExpirationDate;
      await admin.save();
    }
  
    res
      .status(StatusCodes.OK)
      .json({ msg: 'Please check your email for reset password link' });
  };
  const adminResetPassword = async (req, res) => {
    const { token, email, password } = req.body;
    if (!token || !email || !password) {
      throw new CustomError.BadRequestError('Please provide all values');
    }
    const admin = await Admin.findOne({ email });
  
    if (admin) {
      const currentDate = new Date();
  
      if (
        admin.passwordToken === createHash(token) &&
        admin.passwordTokenExpirationDate > currentDate
      ) {
        admin.password = password;
        admin.passwordToken = null;
        admin.passwordTokenExpirationDate = null;
        await admin.save();
      }
    }
  
    res.send('reset password');
  };

  const showCurrentAdmin = async (req, res) => {
    res.status(StatusCodes.OK).json({ admin: req.admin });
  };
  
  module.exports = {
    adminRegister,
    adminLogin,
    adminLogout,
    adminVerifyEmail,
    adminForgotPassword,
    adminResetPassword,
    showCurrentAdmin,
  };
  