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

const sendResetPassword = async ({ teacher, token, origin }) => {
  console.log('Teacher Object:', teacher); 
  const transporter = await createTransporter();

  const resetURL = `${origin}/user/reset-password?token=${token}&email=${teacher.email}`;
  const message = `<p>Please reset your password by clicking on the following link : 
    <a href="${resetURL}">Reset Password</a></p>`;

  return transporter.sendMail({
    from: '"EduPlay" <eduplay@gmail.com>', 
    to: teacher.email,
    subject: "Reset Password",
    html: `<h4>Hello, ${teacher.name}</h4>
      ${message}
    `,
  });
};

module.exports = sendResetPassword;
