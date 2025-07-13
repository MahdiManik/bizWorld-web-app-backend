import nodemailer from "nodemailer";

/**
 * Sends a status notification email to a user when their account status changes
 * @param to - recipient email address
 * @param userName - name of the user to personalize the email
 * @param status - 'ACTIVE' or 'REJECTED' status to determine which template to use
 */
export const sendStatusNotificationEmail = async ({
  to,
  userName,
  status,
}: {
  to: string;
  userName: string;
  status: 'ACTIVE' | 'REJECTED';
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const subject = status === 'ACTIVE' 
    ? "Your Account Has Been Approved!" 
    : "Important Information About Your Account";

  const html = getStatusEmailTemplate(status, userName);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

/**
 * Generates HTML email templates for different status notifications
 */
const getStatusEmailTemplate = (
  status: 'ACTIVE' | 'REJECTED',
  userName: string
): string => {
  // Common styles
  const containerStyle = `
    font-family: Arial, sans-serif;
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
    border-radius: 8px;
    color: #333;
  `;

  const headerStyle = `
    padding: 20px;
    text-align: center;
    border-radius: 8px 8px 0 0;
  `;

  const bodyStyle = `
    background-color: #ffffff;
    padding: 30px;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  `;

  const buttonStyle = `
    display: inline-block;
    background-color: #007BFF;
    color: #ffffff !important;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 4px;
    margin: 20px 0;
    font-weight: bold;
    text-align: center;
  `;

  const footerStyle = `
    margin-top: 20px;
    text-align: center;
    font-size: 14px;
    color: #666;
  `;

  if (status === 'ACTIVE') {
    // Approved email template
    return `
      <div style="${containerStyle}">
        <div style="${headerStyle}background-color: #ebf7fd;">
          <h2 style="color: #007BFF; margin: 0;">Welcome to bizNest!</h2>
        </div>
        <div style="${bodyStyle}">
          <p>Hi ${userName},</p>
          <p>Great news! Your account has been <strong>approved</strong> and you now have full access to bizNest.</p>
          <p>You can now log in with your registered email address and start exploring all the features our platform has to offer.</p>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'https://biznest.nexstack.app'}/login" style="${buttonStyle}">Log In Now</a>
          </div>
          
          <p>With bizNest, you can:</p>
          <ul>
            <li>Manage your business profile</li>
            <li>Connect with partners and clients</li>
            <li>Access specialized business tools</li>
            <li>Track your business growth</li>
          </ul>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          
          <p>We're excited to have you on board!</p>
          <p>Best regards,<br>The bizNest Team</p>
        </div>
        <div style="${footerStyle}">
          <p>&copy; ${new Date().getFullYear()} bizNest. All rights reserved.</p>
        </div>
      </div>
    `;
  } else {
    // Rejected email template
    return `
      <div style="${containerStyle}">
        <div style="${headerStyle}background-color: #fdf0eb;">
          <h2 style="color: #e67e22; margin: 0;">Account Status Update</h2>
        </div>
        <div style="${bodyStyle}">
          <p>Hi ${userName},</p>
          <p>Thank you for your interest in bizNest.</p>
          <p>We regret to inform you that we were unable to approve your account at this time. This could be due to one or more of the following reasons:</p>
          
          <ul>
            <li>Incomplete company information</li>
            <li>Verification issues with provided documents</li>
            <li>Non-compliance with our platform requirements</li>
          </ul>
          
          <p>We encourage you to review your information and try again. For specific details about why your account was not approved, please contact our support team.</p>
          
          <div style="text-align: center;">
            <a href="mailto:support@biznest.com" style="${buttonStyle}background-color: #e67e22;">Contact Support</a>
          </div>
          
          <p>Thank you for your understanding.</p>
          <p>Best regards,<br>The bizNest Team</p>
        </div>
        <div style="${footerStyle}">
          <p>&copy; ${new Date().getFullYear()} bizNest. All rights reserved.</p>
        </div>
      </div>
    `;
  }
};
