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

const sendVerification = async ({ name, email, verificationToken, origin }) => {
  const transporter = await createTransporter();

  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email by clicking on the following link : 
    <a href="${verifyEmail}">Verify Email</a> </p>`;

  return transporter.sendMail({
    from: '"EduPlay" <eduplay1909@gmail.com>', 
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello, ${name}</h4>
      ${message}
    `,
  });
};

module.exports = sendVerification;
