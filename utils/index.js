const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const createTokenUser = require('./createTokenUser');
const checkPermissions = require('./checkPerms');
const sendVerification = require('./sendVerification');
const sendResetPassword = require('./sendResetPassword');
const createHash = require('./createHash');

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
  sendVerification,
  sendResetPassword,
  createHash,
};
