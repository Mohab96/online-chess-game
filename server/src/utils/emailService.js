const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendVerificationEmail(email, otp) {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendVerificationEmail,
};
