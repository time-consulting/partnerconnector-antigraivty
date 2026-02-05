import { google } from 'googleapis';

export interface DealSheetData {
  partnerId: string;
  partnerName: string;
  partnerEmail: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessType: string;
  currentProcessor: string;
  monthlyVolume: string;
  currentRate: string;
  selectedProducts: string;
  cardMachineQuantity: number;
  status: string;
  estimatedCommission: string;
  submittedAt: string;
  notes: string;
}

class GoogleSheetsService {
  private sheets: any;
  private spreadsheetId: string = '';
  private isInitialized: boolean = false;

  constructor() {
    if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !process.env.GOOGLE_SHEETS_PRIVATE_KEY || !process.env.GOOGLE_SPREADSHEET_ID) {
      console.warn('Google Sheets credentials not configured - sheet sync will be disabled');
      return;
    }

    try {
      // Clean up the private key - handle multiple formats
      let privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
      
      // Remove quotes if present
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }
      
      // Replace escaped newlines
      privateKey = privateKey.replace(/\\n/g, '\n');

      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
          private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      this.spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID!;
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Google Sheets:', error);
      console.warn('Google Sheets sync will be disabled');
    }
  }

  async initializeSheet(): Promise<void> {
    if (!this.isInitialized) {
      console.warn('Google Sheets not initialized - skipping sheet initialization');
      return;
    }
    
    try {
      // Create headers if they don't exist
      const headers = [
        'Partner ID',
        'Partner Name', 
        'Partner Email',
        'Business Name',
        'Business Email',
        'Business Phone',
        'Business Address',
        'Business Type',
        'Current Processor',
        'Monthly Volume',
        'Current Rate',
        'Selected Products',
        'Card Machine Quantity',
        'Status',
        'Estimated Commission',
        'Submitted At',
        'Notes'
      ];

      // Check if headers exist
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'A1:Q1',
      });

      if (!response.data.values || response.data.values.length === 0) {
        // Add headers
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: 'A1:Q1',
          valueInputOption: 'RAW',
          requestBody: {
            values: [headers],
          },
        });
      }
    } catch (error) {
      console.error('Error initializing Google Sheets:', error);
      throw error;
    }
  }

  async addDeal(data: DealSheetData): Promise<void> {
    if (!this.isInitialized) {
      console.warn('Google Sheets not initialized - skipping deal sync');
      return;
    }
    
    try {
      await this.initializeSheet();

      const values = [
        data.partnerId,
        data.partnerName,
        data.partnerEmail,
        data.businessName,
        data.businessEmail,
        data.businessPhone || '',
        data.businessAddress || '',
        data.businessType,
        data.currentProcessor || '',
        data.monthlyVolume || '',
        data.currentRate || '',
        data.selectedProducts || '',
        data.cardMachineQuantity.toString(),
        data.status,
        data.estimatedCommission || '',
        data.submittedAt,
        data.notes || ''
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'A:Q',
        valueInputOption: 'RAW',
        requestBody: {
          values: [values],
        },
      });

      console.log('Referral added to Google Sheets successfully');
    } catch (error) {
      console.error('Error adding deal to Google Sheets:', error);
      throw error;
    }
  }

  async updateReferralStatus(partnerId: string, businessName: string, newStatus: string): Promise<void> {
    if (!this.isInitialized) {
      console.warn('Google Sheets not initialized - skipping status update');
      return;
    }
    
    try {
      // Get all data to find the row
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'A:Q',
      });

      if (!response.data.values) {
        throw new Error('No data found in spreadsheet');
      }

      const rows = response.data.values;
      let rowIndex = -1;

      // Find the row with matching partner ID and business name
      for (let i = 1; i < rows.length; i++) { // Start from 1 to skip headers
        if (rows[i][0] === partnerId && rows[i][3] === businessName) {
          rowIndex = i + 1; // Convert to 1-based index
          break;
        }
      }

      if (rowIndex > 0) {
        // Update the status column (column N, index 13)
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `N${rowIndex}`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [[newStatus]],
          },
        });

        console.log(`Updated deal status in Google Sheets: ${newStatus}`);
      } else {
        console.warn(`Referral not found in Google Sheets: ${partnerId} - ${businessName}`);
      }
    } catch (error) {
      console.error('Error updating deal status in Google Sheets:', error);
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();