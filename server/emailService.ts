import sgMail from '@sendgrid/mail';

// Email service configuration
class EmailService {
  private isConfigured: boolean = false;

  constructor() {
    // Configure SendGrid if API key is provided
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      this.isConfigured = true;
      console.log('SendGrid email service configured');
    } else {
      console.log('SendGrid API key not found - email functionality will be disabled');
    }
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }): Promise<boolean> {
    if (!this.isConfigured) {
      console.log(`Email not sent (no SendGrid config): ${options.subject} to ${options.to}`);
      return false;
    }

    try {
      const msg = {
        to: options.to,
        from: options.from || process.env.FROM_EMAIL || 'noreply@partnerconnector.com',
        subject: options.subject,
        html: options.html,
      };

      await sgMail.send(msg);
      console.log(`Email sent successfully: ${options.subject} to ${options.to}`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.APP_URL || 'http://localhost:5000'}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password for your PartnerConnector account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              <p>For security reasons, this link will expire in 1 hour.</p>
              <p>Best regards,<br>The PartnerConnector Team</p>
            </div>
            <div class="footer">
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p>${resetUrl}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Reset your PartnerConnector password',
      html
    });
  }

  async sendWelcomeEmail(email: string, firstName?: string): Promise<boolean> {
    const name = firstName ? `Hello ${firstName}` : 'Hello';
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to PartnerConnector!</h1>
            </div>
            <div class="content">
              <p>${name},</p>
              <p>Welcome to PartnerConnector! We're excited to have you join our community of business partners.</p>
              <p>With PartnerConnector, you can:</p>
              <ul>
                <li>Submit referrals and track their progress</li>
                <li>Earn commissions on successful conversions</li>
                <li>Manage your leads and clients</li>
                <li>Access comprehensive reporting and analytics</li>
              </ul>
              <a href="${process.env.APP_URL || 'http://localhost:5000'}/dashboard" class="button">Get Started</a>
              <p>If you have any questions, our support team is here to help!</p>
              <p>Best regards,<br>The PartnerConnector Team</p>
            </div>
            <div class="footer">
              <p>You're receiving this email because you signed up for PartnerConnector.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to PartnerConnector!',
      html
    });
  }

  async sendQuoteNotification(email: string, businessName: string, quoteAmount?: number): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9f9f9; }
            .highlight { background: #e5f7f0; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Quote Ready!</h1>
            </div>
            <div class="content">
              <p>Great news!</p>
              <p>A quote has been prepared for your referral: <strong>${businessName}</strong></p>
              ${quoteAmount ? `<div class="highlight">
                <h3>Quote Amount: £${quoteAmount.toLocaleString()}</h3>
              </div>` : ''}
              <p>The quote has been sent to the client for review. You'll be notified once they respond.</p>
              <p>Keep up the great work!</p>
              <p>Best regards,<br>The PartnerConnector Team</p>
            </div>
            <div class="footer">
              <p>Track all your referrals in your dashboard</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: `Quote ready for ${businessName}`,
      html
    });
  }

  async sendCommissionNotification(email: string, businessName: string, amount: number): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9f9f9; }
            .highlight { background: #e5f7f0; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; text-align: center; }
            .amount { font-size: 2em; font-weight: bold; color: #10b981; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Commission Paid!</h1>
            </div>
            <div class="content">
              <p>Congratulations!</p>
              <p>Your commission has been processed for the referral: <strong>${businessName}</strong></p>
              <div class="highlight">
                <div class="amount">£${amount.toLocaleString()}</div>
                <p>has been paid to your account</p>
              </div>
              <p>Thank you for your continued partnership. Keep referring and earning!</p>
              <p>Best regards,<br>The PartnerConnector Team</p>
            </div>
            <div class="footer">
              <p>View your commission history in your dashboard</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: `Commission paid: £${amount.toLocaleString()}`,
      html
    });
  }

  async sendInviteEmail(email: string, inviterName: string, inviteLink: string): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>You're Invited to PartnerConnector!</h1>
            </div>
            <div class="content">
              <p>Hello!</p>
              <p>${inviterName} has invited you to join their team on PartnerConnector, where you can earn commissions by connecting clients with partners for payment processing solutions.</p>
              <p>Join our community to:</p>
              <ul>
                <li>Submit referrals and track their progress</li>
                <li>Earn commissions on successful conversions</li>
                <li>Access comprehensive analytics and reporting</li>
                <li>Build your network and earn overrides up to 3 levels</li>
              </ul>
              <a href="${inviteLink}" class="button">Accept Invitation</a>
              <p>Start earning commissions today by connecting clients with payment solutions!</p>
              <p>Best regards,<br>The PartnerConnector Team</p>
            </div>
            <div class="footer">
              <p>This invitation was sent by ${inviterName} through PartnerConnector.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: `${inviterName} invited you to join PartnerConnector`,
      html
    });
  }
}

export const emailService = new EmailService();