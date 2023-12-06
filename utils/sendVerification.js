const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
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
    theme: "salted",
    product: {
      name: "EduPlay",
      link: "https://eduplay-lhjs.onrender.com/",
      logo: "https://your-logo-url.com/logo.png",
    },
  });

  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;

  const emailContent = {
    body: {
      name: "EduPlay",
      title: "Email Confirmation",
      intro: "Please confirm your email by clicking on the following link:",
      action: {
        instructions:
          "Verifying your email gives you access to EduPlay. Click the button below:",
        button: {
          color: "#22BC66",
          text: "CONFIRM EMAIL",
          link: verifyEmail,
        },
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
