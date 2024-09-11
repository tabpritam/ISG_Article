// utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SENDINBLUE_SMTP_HOST,
      port: process.env.SENDINBLUE_SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SENDINBLUE_SMTP_USER,
        pass: process.env.SENDINBLUE_SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SENDINBLUE_SMTP_USER,
      to: email,
      subject: subject,
      text: message,
    });

    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
