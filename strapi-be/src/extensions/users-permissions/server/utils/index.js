"use strict";

const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const sanitize = require("./sanitize");

const getService = (name) => {
  return strapi.plugin("users-permissions").service(name);
};

const createOtpToken = async ({ payload: { userId } }) => {
  const otpCode = otpGenerator.generate(4, {
    digits: true,
    specialChars: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
  });

  const verifyOtpToken = crypto
    .createHash("sha256")
    .update(otpCode)
    .digest("hex");

  const verifyOtpExpires = Date.now() + 1 * 60 * 1000;

  // await getService("user").edit(userId, {
  //   data: {
  //     verifyOtpToken: verifyOtpToken,
  //     verifyOtpExpires: verifyOtpExpires,
  //   },
  // });

  // console.log("user", getService("user").findOne(userId));

  return { otpCode, verifyOtpToken, verifyOtpExpires };
};

module.exports = {
  getService,
  sanitize,
  createOtpToken,
};
