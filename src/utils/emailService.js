const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: false,
  port: 587,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

const sendVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
};
