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
  try {
    if (!teacher || !teacher.email) {
      throw new Error("Email not provided for password reset.");
    }

    const resetURL = `${origin}/user/reset-password?token=${token}&email=${teacher.email}`;

    console.log("Reset URL:", resetURL);
    console.log("Token sent in email:", token);

    const transporter = await createTransporter();

    const message = `<p>Please reset your password by clicking on the following link : 
      <a href="${resetURL}">Reset Password</a></p>`;

    const mailOptions = {
      from: '"EduPlay" <eduplay1909@gmail.com>',
      to: teacher.email,
      subject: "Reset Password",
      html: `<h4>Hello, ${teacher.name}</h4>
        ${message}
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info);

    return info;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

module.exports = sendResetPassword;
