const speakeasy = require("speakeasy");

function generateSecret() {
  return speakeasy.generateSecret({ length: 20 }).base32;
}

function generateOTP(secret) {
  return speakeasy.totp({
    secret,
    encoding: "base32",
    digits: 4,
  });
}

function verifyOTP(otp, secret) {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token: otp,
    window: 4,
    digits: 4,
  });
}

module.exports = {
  generateSecret,
  generateOTP,
  verifyOTP,
};
