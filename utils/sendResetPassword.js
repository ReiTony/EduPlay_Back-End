const nodemailer = require("nodemailer");
require("dotenv").config();

const createTransporter = async () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASS,
    },
  });

  return transporter;
};

const sendResetPassword = async ({ name, email, token, origin }) => {
  const user = getUserByEmail(email);

  const transporter = await createTransporter(user.email, user.password);

  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const message = `<p>Please reset your password by clicking on the following link : 
    <a href="${resetURL}">Reset Password</a></p>`;

  return transporter.sendMail({
    from: '"EduPlay" <eduplay@gmail.com>', 
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello, ${name}</h4>
      ${message}
    `,
  });
};

module.exports = sendResetPassword;
