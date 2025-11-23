const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send OTP Email with beautiful HTML template
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Auth System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Email Verification OTP',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 10px 10px 0 0; 
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content { 
            background: #f9f9f9; 
            padding: 30px; 
            border-radius: 0 0 10px 10px; 
          }
          .otp-box { 
            background: white; 
            padding: 20px; 
            text-align: center; 
            margin: 20px 0; 
            border-radius: 8px; 
            border: 2px dashed #667eea; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .otp-code { 
            font-size: 36px; 
            font-weight: bold; 
            color: #667eea; 
            letter-spacing: 8px; 
            margin: 10px 0;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 15px 0;
            border-radius: 4px;
          }
          .footer { 
            text-align: center; 
            margin-top: 20px; 
            color: #666; 
            font-size: 12px; 
            padding: 20px;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Email Verification</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Thank you for registering with us! Please use the following One-Time Password (OTP) to verify your email address:</p>
            
            <div class="otp-box">
              <p style="margin: 0; font-size: 14px; color: #666;">Your Verification Code</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; font-size: 12px; color: #999;">Enter this code to complete verification</p>
            </div>
            
            <div class="warning">
              <strong>⏰ Important:</strong> This code will expire in <strong>10 minutes</strong>.
            </div>
            
            <p>If you didn't request this verification code, please ignore this email or contact support if you have concerns.</p>
            
            <p style="margin-top: 30px;">Best regards,<br><strong>Auth System Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p style="color: #999;">© 2024 Auth System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`);
    console.log(`Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    throw new Error('Failed to send OTP email. Please check your email configuration.');
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail
};