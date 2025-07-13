"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = exports.sendOTPEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendOTPEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, otp, context = "signup", }) {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const html = getEmailTemplate(context, otp);
    yield transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    });
});
exports.sendOTPEmail = sendOTPEmail;
const sendWelcomeEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, name, email, password, loginUrl = "https://bizworld.com/login", }) {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const html = getWelcomeTemplate(name, email, password, loginUrl);
    yield transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Welcome to BizWorld App - Your Account Information",
        html,
    });
});
exports.sendWelcomeEmail = sendWelcomeEmail;
const getWelcomeTemplate = (name, email, password, loginUrl) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <!-- Header -->
      <div style="background-color: #007BFF; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">BizWorld App</h1>
      </div>
      
      <!-- Email Content -->
      <div style="padding: 20px;">
        <p style="margin-top: 0;">Dear ${name},</p>
        
        <p>Your account for BizWorld App has been successfully created.</p>
        <p>You can now log in using the credentials below:</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Login Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${password}</p>
        </div>
        
        <p>To ensure the security of your account, please log in and update your password immediately after your first login.</p>
        
        <p>Login here: <a href="${loginUrl}" style="color: #007BFF;">Click here to login</a></p>
        
        <p>If you have any questions or need help getting started, feel free to reach out to our support team.</p>
        <p>Thanks for joining us!</p>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="margin: 0;"><strong>Contact Support</strong></p>
        <p style="margin: 10px 0 0;">Best regards,<br>BizWorld Team<br>bizworld@example.com</p>
      </div>
    </div>
  `;
};
const getEmailTemplate = (context, otp) => {
    const style = `
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    color: #333;
  `;
    const otpStyle = `
    font-size: 24px;
    font-weight: bold;
    color: #007BFF;
  `;
    const titleMap = {
        signup: "Verify Your Email",
        reset: "Reset Your Password",
        adminReset: "Admin Password Reset",
    };
    return `
    <div style="${style}">
      <h2>${titleMap[context]}</h2>
      <p>Your One-Time Password (OTP) is:</p>
      <p style="${otpStyle}">${otp}</p>
      <p>This OTP is valid for the next 10 minutes. If you didn’t request this, please ignore this email.</p>
    </div>
  `;
};
