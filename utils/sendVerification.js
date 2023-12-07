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

const sendVerification = async ({ name, email, verificationToken, origin }) => {
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

  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;

  const emailContent = {
    body: {
      name,
      title: "Welcome to EduPlay!",
      intro: "EduPlay, your trusted school management partner! To secure your account,",
      intro2: "please confirm your email address by clicking on the button below:",
      button: {
        color: "#22BC66",
        text: "CONFIRM EMAIL",
        link: verifyEmail,
      },
    },
  };
  const emailTemplate = mailGenerator.generate(emailContent);

  return transporter.sendMail({
    from: '"EduPlay" <eduplay1909@gmail.com>',
    to: email,
    subject: "Email Confirmation",
    html: emailTemplate,
  });
};

module.exports = sendVerification;
