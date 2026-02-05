import axios from 'axios';

// GoHighLevel SMS Service for 2FA Verification Codes
class GHLSmsService {
  private isConfigured: boolean = false;
  private apiToken: string = '';
  private locationId: string = '';
  private adminPhone: string = ''; // Your phone number for 2FA codes
  private baseUrl: string = 'https://services.leadconnectorhq.com';

  constructor() {
    // Configure GoHighLevel if credentials are provided
    if (process.env.GHL_API_TOKEN && process.env.GHL_LOCATION_ID && process.env.GHL_ADMIN_PHONE) {
      this.apiToken = process.env.GHL_API_TOKEN;
      this.locationId = process.env.GHL_LOCATION_ID;
      this.adminPhone = process.env.GHL_ADMIN_PHONE;
      this.isConfigured = true;
      console.log('GoHighLevel SMS service configured for admin phone:', this.adminPhone.replace(/\d(?=\d{4})/g, '*'));
    } else {
      console.log('GoHighLevel SMS credentials not found - 2FA SMS will be disabled');
      console.log('Required env vars: GHL_API_TOKEN, GHL_LOCATION_ID, GHL_ADMIN_PHONE');
    }
  }

  /**
   * Send SMS via GoHighLevel Conversations API
   */
  async sendSMS(to: string, message: string): Promise<boolean> {
    if (!this.isConfigured) {
      console.log(`[GHL SMS] Service not configured - SMS not sent to ${to}`);
      console.log(`[GHL SMS] Message would have been: ${message}`);
      return false;
    }

    try {
      // GHL expects phone numbers in E.164 format (+44...)
      const formattedPhone = to.startsWith('+') ? to : `+${to}`;

      const payload = {
        type: 'SMS',
        contactId: null, // Direct SMS without contact
        locationId: this.locationId,
        message: message,
        phone: formattedPhone,
      };

      console.log('[GHL SMS] Sending SMS:', {
        to: formattedPhone.replace(/\d(?=\d{4})/g, '*'),
        messageLength: message.length
      });

      const response = await axios.post(
        `${this.baseUrl}/conversations/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Version': '2021-07-28',
            'Content-Type': 'application/json',
          }
        }
      );

      console.log(`[GHL SMS] SMS sent successfully:`, response.data);
      return true;
    } catch (error: any) {
      console.error('[GHL SMS] Error sending SMS:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Send 2FA verification code to admin
   */
  async send2FACode(code: string, dealInfo: {
    businessName: string;
    amount: number;
    dealId: string;
  }): Promise<boolean> {
    if (!this.isConfigured) {
      console.log(`[GHL SMS] 2FA Code: ${code} for deal ${dealInfo.dealId}`);
      console.log(`[GHL SMS] Business: ${dealInfo.businessName}, Amount: £${dealInfo.amount}`);
      return false;
    }

    const message = `PartnerConnector Payment Verification

Code: ${code}

Deal: ${dealInfo.businessName}
Amount: £${dealInfo.amount.toFixed(2)}
Deal ID: ${dealInfo.dealId}

This code expires in 10 minutes.`;

    return await this.sendSMS(this.adminPhone, message);
  }

  /**
   * Check if SMS service is configured
   */
  isServiceConfigured(): boolean {
    return this.isConfigured;
  }

  /**
   * Get admin phone number (masked)
   */
  getAdminPhone(): string {
    if (!this.isConfigured) return 'Not configured';
    return this.adminPhone.replace(/\d(?=\d{4})/g, '*');
  }
}

export const ghlSmsService = new GHLSmsService();
