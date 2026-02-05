# Commission Withdrawal System - Complete Test Guide

This guide walks you through testing the complete commission withdrawal flow from referral submission to final payment.

## System Overview

The commission withdrawal system follows this flow:

1. **Partner submits referral** → Status: "submitted", Deal Stage: "quote_request"
2. **Admin reviews & sends quote** → Deal Stage: "quote_sent"
3. **Admin progresses through pipeline** → Deal Stages: quote_approved → agreement_sent → signed_awaiting_docs → approved → live_confirm_ltr
4. **Admin marks as Live** → Deal Stage: "live"
5. **Admin creates multi-level commissions** → Splits payment 60%/20%/10% across levels
6. **Partner approves commission** → Payment Status: "approved_pending"
7. **Admin processes withdrawal** → Payment Status: "paid", Deal Stage: "live_paid"
8. **Payment appears in Withdrawals tab** → Complete!

---

## Prerequisites

Before starting, ensure you have:
- ✅ An admin account (user with `isAdmin: true`)
- ✅ A partner account (regular user with referral code)
- ✅ Bank details set up for the partner account
- ✅ At least one business type in the database

---

## Step-by-Step Test Instructions

### STEP 1: Submit a Test Referral

**As Partner User:**

1. Navigate to the **Referral Form** page
2. Fill in the business details:
   - Business Name: `Test Coffee Shop Ltd`
   - Business Email: `testcafe@example.com`
   - Business Phone: `07700 900000`
   - Business Type: Select any available option (e.g., "Retail")
   - Current Processor: `WorldPay`
   - Monthly Volume: `£25,000`
   - Current Rate: `1.5%`

3. Upload a test document:
   - You can use `/tmp/test-bill.txt` or any small PDF/image file
   - Click "Upload Bill" and select the file

4. Select products:
   - Check "Card Payments" or other available products

5. Agree to GDPR consent and click **Submit Referral**

6. ✅ **Verify**: You should see a success message and the referral should appear in your referrals list

---

### STEP 2: Admin Reviews Quote Request

**As Admin User:**

1. Navigate to **Admin Portal** (`/admin`)
2. Click on **Quote Requests** tab
3. Find "Test Coffee Shop Ltd" in the list
4. Click **View Details** on the referral

5. Review the referral information:
   - Business details
   - Current processor
   - Monthly volume
   - Uploaded documents

6. Click **Send Quote**
7. Fill in quote details:
   - Transaction Rate: `1.2%`
   - Monthly Fee: `£25`
   - Terminal Rental: `£15`

8. Click **Send Quote to Client**

9. ✅ **Verify**: Deal Stage should change to "quote_sent"

---

### STEP 3: Progress Deal Through Pipeline

**As Admin User:**

1. Go to **Deal Management Pipeline**
2. Navigate through the tabs in order, moving the deal forward:

   **a) Sent Quotes Tab:**
   - Find "Test Coffee Shop Ltd"
   - Click **Approve** to move to next stage

   **b) Sign Up Tab:**
   - Find the deal
   - Click **Send Agreement** or **Mark Signed**

   **c) Docs Out Tab:**
   - Confirm documents have been sent
   - Click **Confirm Docs Sent**

   **d) Awaiting Docs Tab:**
   - Mark documents as received
   - Click **Mark as Approved**

   **e) Approved Tab:**
   - Find the deal
   - Click **Mark as Live**

3. ✅ **Verify**: Deal Stage should now be "live"

---

### STEP 4: Create Multi-Level Commissions

**As Admin User:**

1. Navigate to **Commission Payments** (`/admin-payments`)
2. You should see "Test Coffee Shop Ltd" under **Payment Portal**
3. Click **Process Payment**

4. In the payment dialog:
   - Total Commission Amount: `£1000` (example)
   - Click **Calculate Split**

5. Review the commission breakdown:
   - Level 1 (Direct - 60%): £600.00
   - Level 2 (Parent - 20%): £200.00 (if partner has upline)
   - Level 3 (Grandparent - 10%): £100.00 (if exists)

6. Click **Process Payment via Stripe**
7. Confirm the payment

8. ✅ **Verify**: 
   - Commissions should be created
   - Deal Stage remains "live"
   - Payment Status: "pending"

---

### STEP 5: Partner Approves Commission

**As Partner User:**

1. Navigate to **Commissions** page (`/commissions`)
2. Go to the **Commissions** tab
3. Find "Test Coffee Shop Ltd" commission (£600.00)
4. Status should show "Pending approval"

5. Click **Approve** button
6. Confirm approval in the dialog

7. ✅ **Verify**: 
   - Commission Status changes to "Approved"
   - Payment Status: "approved_pending"
   - Commission amount: £600.00

---

### STEP 6: Admin Processes Withdrawal

**As Admin User:**

1. Navigate to **Commission Payments** (`/admin-payments`)
2. Look for the **Approved Commissions Ready for Withdrawal** section
3. Find "Test Coffee Shop Ltd" commission (£600.00)

4. You should see:
   - Business Name: Test Coffee Shop Ltd
   - Recipient details
   - Bank account (last 4 digits)
   - Amount: £600.00

5. Click **Mark as Paid** button

6. In the withdrawal dialog:
   - Enter Transfer Reference (optional): `TXN123456789`
   - Click **Confirm Payment Sent**

7. ✅ **Verify**: 
   - Commission disappears from approved list
   - Success toast message appears

---

### STEP 7: Verify Final State

**As Partner User:**

1. Navigate to **Commissions** page (`/commissions`)
2. Click on the **Withdrawals** tab

3. You should see the payment record:
   - Business Name: Test Coffee Shop Ltd
   - Type: Level 1 - Direct (60%)
   - Deal Stage: Live-Paid (green badge)
   - Payment Date: Current date and time
   - Transfer Reference: TXN123456789
   - Amount: £600.00 (in green)

**As Admin User:**

1. Navigate to **Deal Management Pipeline**
2. Go to the **Live-Paid** tab (if exists) or check the deal stage
3. ✅ **Verify**: "Test Coffee Shop Ltd" should show Deal Stage: "live_paid"

---

## Key Features to Test

### Commission Calculation
- ✅ Direct commission (Level 1): 60% of total
- ✅ Parent commission (Level 2): 20% of total
- ✅ Grandparent commission (Level 3): 10% of total

### Status Transitions
- ✅ Pending → Approved → Paid
- ✅ Deal Stage: live → live_paid (after withdrawal)

### Data Display
- ✅ Withdrawals tab shows payment history
- ✅ Payment date is recorded
- ✅ Transfer reference is stored (optional)
- ✅ Deal stage updates automatically

### Admin Controls
- ✅ Approved payments section appears
- ✅ Bank details displayed (masked)
- ✅ Withdrawal confirmation dialog
- ✅ Transfer reference input (optional)

---

## Troubleshooting

### Commission Not Appearing
- Check that deal stage is "live"
- Verify commission was created via admin portal
- Ensure payment amount was entered

### Cannot Approve Commission
- Verify partner bank details are set up
- Check commission status is "pending"
- Ensure you're logged in as the recipient

### Withdrawal Not Processing
- Verify commission status is "approved_pending"
- Check admin permissions
- Review browser console for errors

---

## Database Verification (Optional)

You can verify the data directly in the database:

```sql
-- Check referral status
SELECT id, business_name, deal_stage, status 
FROM referrals 
WHERE business_name = 'Test Coffee Shop Ltd';

-- Check commission payments
SELECT id, business_name, level, amount, approval_status, payment_status, payment_date, transfer_reference
FROM commission_payments 
WHERE business_name = 'Test Coffee Shop Ltd';

-- Check that deal stage updated
SELECT deal_stage FROM referrals WHERE business_name = 'Test Coffee Shop Ltd';
-- Should return: live_paid
```

---

## Success Criteria

The test is successful when:

- ✅ Referral submitted with document upload
- ✅ Admin can review and send quote
- ✅ Deal progresses through all pipeline stages
- ✅ Multi-level commissions are created correctly (60/20/10 split)
- ✅ Partner can approve their commission
- ✅ Admin can process withdrawal with transfer reference
- ✅ Deal stage updates to "live_paid"
- ✅ Payment appears in partner's Withdrawals tab with all details
- ✅ Payment date and transfer reference are recorded

---

## Next Steps

After successful testing, you can:

1. Test with multiple upline levels (MLM structure)
2. Test bulk withdrawals for multiple commissions
3. Test edge cases (missing bank details, declined approvals)
4. Set up automated notifications for withdrawal events
5. Add CSV export for withdrawal history

---

**End of Test Guide**
