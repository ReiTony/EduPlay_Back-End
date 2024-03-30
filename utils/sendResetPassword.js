const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const path = require("path");
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

    const transporter = await createTransporter();

    const mailGenerator = new Mailgen({
      theme: {
        path: path.resolve(__dirname, "../utils/eduplay-Theme.html"),
      },
      product: {
        name: "EduPlay",
        link: "https://eduplay-lhjs.onrender.com/",
        logo: "https://drive.google.com/uc?id=1AvTHkFmbzNKkuAGo4K2Lx-jtecs9LiMI",
        logoHeight: "200px",
      },
    });

    const resetURL = `${origin}/user/reset-password?token=${token}&email=${teacher.email}`;

    const emailContent = {
      body: {
        name: teacher.name,
        title: "Password Reset",
        intro: "Click the button below to reset your password:",
        intro2: "If you did not request a password reset, please ignore this email.",
        button: {
          color: "red",
          text: "RESET PASSWORD",
          link: resetURL,
        },
      },
    };

    const emailTemplate = mailGenerator.generate(emailContent);

    const mailOptions = {
      from: '"EduPlay" <eduplay1909@gmail.com>',
      to: teacher.email,
      subject: "Password Reset",
      html: emailTemplate,
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
