import axios from 'axios';

// GoHighLevel Email Service Configuration
class GHLEmailService {
  private isConfigured: boolean = false;
  private apiToken: string = '';
  private locationId: string = '';
  private fromEmail: string = '';
  private webhookUrl: string = '';
  private baseUrl: string = 'https://services.leadconnectorhq.com';

  constructor() {
    // Configure GoHighLevel if credentials are provided
    if (process.env.GHL_API_TOKEN && process.env.GHL_LOCATION_ID && process.env.GHL_FROM_EMAIL) {
      this.apiToken = process.env.GHL_API_TOKEN;
      this.locationId = process.env.GHL_LOCATION_ID;
      this.fromEmail = process.env.GHL_FROM_EMAIL;
      this.webhookUrl = process.env.GHL_WEBHOOK_URL || 'https://services.leadconnectorhq.com/hooks/CKsHxXXkohjNVVgYzMoG/webhook-trigger/d30b9f55-149f-4e5d-8b9a-9116b0d82415';
      this.isConfigured = true;
      console.log('GoHighLevel email service configured with webhook:', this.webhookUrl);
    } else {
      console.log('GoHighLevel credentials not found - email functionality will be disabled');
    }
  }

  /**
   * Trigger GHL automation via webhook
   */
  private async triggerWebhook(eventType: string, data: any): Promise<boolean> {
    if (!this.isConfigured || !this.webhookUrl) {
      console.log(`GHL webhook not triggered (no config): ${eventType}`);
      return false;
    }

    try {
      const payload = {
        eventType,
        timestamp: new Date().toISOString(),
        locationId: this.locationId,
        ...data
      };

      console.log('[GHL] Triggering webhook:', eventType, JSON.stringify(payload, null, 2));

      await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log(`[GHL] Webhook triggered successfully: ${eventType}`);
      return true;
    } catch (error: any) {
      console.error('[GHL] Webhook trigger error:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Create or update a contact in GoHighLevel
   */
  private async createOrUpdateContact(email: string, firstName?: string, lastName?: string): Promise<string | null> {
    if (!this.isConfigured) {
      console.log(`GHL contact not created (no config): ${email}`);
      return null;
    }

    try {
      // First, search for existing contact
      const searchResponse = await axios.get(`${this.baseUrl}/contacts/`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json',
        },
        params: {
          locationId: this.locationId,
          email: email,
        }
      });

      let contactId: string;

      if (searchResponse.data?.contacts && searchResponse.data.contacts.length > 0) {
        // Contact exists, use existing ID
        contactId = searchResponse.data.contacts[0].id;
        console.log(`Existing GHL contact found: ${contactId}`);
      } else {
        // Create new contact with properly parsed first/last name
        const contactData: any = {
          locationId: this.locationId,
          email: email,
        };

        // Properly handle first name and last name to avoid duplication
        if (firstName) {
          contactData.firstName = firstName.trim();
        }
        if (lastName) {
          contactData.lastName = lastName.trim();
        }

        const createResponse = await axios.post(`${this.baseUrl}/contacts/`, contactData, {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Version': '2021-07-28',
            'Content-Type': 'application/json',
          }
        });

        contactId = createResponse.data.contact.id;
        console.log(`New GHL contact created: ${contactId} (${firstName} ${lastName})`);
      }

      return contactId;
    } catch (error: any) {
      console.error('Error creating/updating GHL contact:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Send email via GoHighLevel Conversations API
   */
  async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    firstName?: string;
    lastName?: string;
  }): Promise<boolean> {
    if (!this.isConfigured) {
      console.log(`GHL email not sent (no config): ${options.subject} to ${options.to}`);
      return false;
    }

    try {
      // Create or get contact first
      const contactId = await this.createOrUpdateContact(options.to, options.firstName, options.lastName);
      
      if (!contactId) {
        console.error('Failed to create/find contact for email');
        return false;
      }

      // Send email via Conversations API
      const emailData = {
        type: 'Email',
        contactId: contactId,
        locationId: this.locationId,
        emailFrom: this.fromEmail,
        subject: options.subject,
        htmlBody: options.html,
        altBody: options.html.replace(/<[^>]*>/g, ''), // Strip HTML for plain text
      };

      await axios.post(`${this.baseUrl}/conversations/messages`, emailData, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json',
        }
      });

      console.log(`GHL email sent successfully: ${options.subject} to ${options.to}`);
      return true;
    } catch (error: any) {
      console.error('Error sending GHL email:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Get the base URL for email links
   * Priority: Custom domain > Replit domains > localhost
   */
  private getBaseUrl(): string {
    // Production custom domain (without www since that's what's configured)
    const customDomain = 'partnerconnector.co.uk';
    
    // Check if we're in production by looking at REPLIT_DOMAINS
    const replitDomains = process.env.REPLIT_DOMAINS;
    if (replitDomains) {
      // If REPLIT_DOMAINS exists, we're in production - use custom domain
      return `https://${customDomain}`;
    }
    
    // Development: use REPLIT_DEV_DOMAIN if available
    if (process.env.REPLIT_DEV_DOMAIN) {
      return `https://${process.env.REPLIT_DEV_DOMAIN}`;
    }
    
    // Fallback to localhost for local development
    return 'http://localhost:5000';
  }

  async sendPasswordResetEmail(email: string, resetToken: string, firstName?: string, lastName?: string): Promise<boolean> {
    const baseUrl = this.getBaseUrl();
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
    
    return this.triggerWebhook('password_reset', {
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      resetUrl,
      resetToken,
      expiresIn: '1 hour'
    });
  }

  async sendWelcomeEmail(email: string, firstName?: string, lastName?: string): Promise<boolean> {
    const baseUrl = this.getBaseUrl();
    const dashboardUrl = `${baseUrl}/dashboard`;
    
    return this.triggerWebhook('welcome_email', {
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      dashboardUrl
    });
  }

  async sendEmailVerification(email: string, verificationToken: string, firstName?: string, lastName?: string): Promise<boolean> {
    const baseUrl = this.getBaseUrl();
    const verifyUrl = `${baseUrl}/verify-email?token=${verificationToken}`;
    
    return this.triggerWebhook('email_verification', {
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      verifyUrl,
      verificationToken
    });
  }

  async sendQuoteNotification(email: string, businessName: string, quoteAmount?: number, firstName?: string, lastName?: string): Promise<boolean> {
    return this.triggerWebhook('quote_notification', {
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      businessName,
      quoteAmount: quoteAmount || 0
    });
  }

  async sendCommissionNotification(email: string, businessName: string, amount: number, firstName?: string, lastName?: string): Promise<boolean> {
    return this.triggerWebhook('commission_paid', {
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      businessName,
      amount
    });
  }

  async sendClientReminder(email: string, businessName: string, firstName?: string, lastName?: string): Promise<boolean> {
    const baseUrl = this.getBaseUrl();
    
    // Try webhook first for automation
    const webhookResult = await this.triggerWebhook('client_reminder', {
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      businessName,
      message: 'Please complete your application to proceed with your payment processing setup.'
    });

    // If webhook fails, try direct email
    if (!webhookResult) {
      return this.sendEmail({
        to: email,
        subject: `Reminder: Complete Your Application - ${businessName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0d9488;">Application Reminder</h2>
            <p>Hi${firstName ? ` ${firstName}` : ''},</p>
            <p>This is a friendly reminder to complete your application for <strong>${businessName}</strong>.</p>
            <p>Your payment processing setup is awaiting completion. Please review and sign the agreement documents to proceed.</p>
            <p>If you have any questions, please don't hesitate to reach out to your partner.</p>
            <br/>
            <p>Best regards,<br/>The Partner Connector Team</p>
          </div>
        `,
        firstName,
        lastName
      });
    }

    return webhookResult;
  }
}

export const ghlEmailService = new GHLEmailService();
