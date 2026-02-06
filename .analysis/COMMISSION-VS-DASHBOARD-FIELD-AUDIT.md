# 🔍 COMMISSION & REFERRAL FIELD VERIFICATION AUDIT
**Generated:** 2026-02-06  
**Purpose:** Verify which fields are used for commission vs dashboard queries BEFORE making changes

---

## CRITICAL ANSWER: TWO SEPARATE SYSTEMS

### ✅ **COMMISSION SYSTEM** (WORKING CORRECTLY)
Uses: `partner_hierarchy` table + `parent_partner_id` field

### ❌ **DASHBOARD SYSTEM** (BROKEN)
Uses: Non-existent `referredBy` field

---

## STEP 1: COMMISSION CALCULATION LOGIC

### A) `distributeCommissions()` Function
**File:** `server/storage.ts` (Lines 3479-3563)

```typescript
/**
 * Distribute commissions for a deal across the referral hierarchy
 * Creates commission approvals for:
 * - Deal creator: 60% (direct commission)
 * - Level 1 up (referrer): 20% (override commission)
 * - Level 2 up (referrer's referrer): 10% (override commission)
 */
async distributeCommissions(
  dealId: string,
  totalCommission: number,
  dealCreatorId: string,
  clientBusinessName?: string,
  adminNotes?: string | null,
  ratesData?: any
): Promise<CommissionApproval[]> {
  const approvals: CommissionApproval[] = [];

  // 1. Create commission for deal creator (60%)
  const creatorCommissionAmount = Number((totalCommission * 0.60).toFixed(2));
  const creatorApproval = await this.createCommissionApproval({
    dealId,
    userId: dealCreatorId,
    commissionAmount: creatorCommissionAmount,
    clientBusinessName,
    commissionType: 'direct',  // Direct commission
    level: 0,  // Deal creator = level 0
    adminNotes,
    ratesData: ratesData ? JSON.stringify(ratesData) : null,
  });
  approvals.push(creatorApproval);

  console.log(`[COMMISSION] Created direct commission: £${creatorCommissionAmount} (60%) for user ${dealCreatorId}`);

  // ✅ 2. Get upline from partner_hierarchy table
  const uplineEntries = await db
    .select()
    .from(partnerHierarchy)
    .where(eq(partnerHierarchy.childId, dealCreatorId))
    .orderBy(partnerHierarchy.level);

  // 3. Create override commissions for upline
  for (const entry of uplineEntries) {
    let overridePercentage = 0;

    if (entry.level === 1) {
      overridePercentage = 0.20;  // 20% for level 1 up
    } else if (entry.level === 2) {
      overridePercentage = 0.10;  // 10% for level 2 up
    }

    if (overridePercentage > 0) {
      const overrideCommissionAmount = Number((totalCommission * overridePercentage).toFixed(2));
      const overrideApproval = await this.createCommissionApproval({
        dealId,
        userId: entry.parentId,  // ✅ Gets parentId from partner_hierarchy
        commissionAmount: overrideCommissionAmount,
        clientBusinessName,
        commissionType: 'override',
        level: entry.level,
        adminNotes: `Level ${entry.level} override commission`,
        ratesData: ratesData ? JSON.stringify(ratesData) : null,
      });
      approvals.push(overrideApproval);

      console.log(`[COMMISSION] Created level ${entry.level} override: £${overrideCommissionAmount} (${overridePercentage * 100}%) for user ${entry.parentId}`);
    }
  }

  return approvals;
}
```

**✅ USES:** `partner_hierarchy` table  
**✅ FIELD:** `childId`, `parentId`, `level`  
**✅ STATUS:** WORKING CORRECTLY

---

### B) `setupReferralHierarchy()` Function
**File:** `server/storage.ts` (Lines 544-616)

```typescript
async setupReferralHierarchy(newUserId: string, referrerUserId: string): Promise<void> {
  const newUser = await this.getUser(newUserId);
  const referrer = await this.getUser(referrerUserId);

  if (!newUser || !referrer) {
    throw new Error('User or referrer not found');
  }

  const referralChain: { userId: string; level: number; commissionPercentage: number }[] = [];

  // Level 1: Direct referrer gets 20% override commission
  referralChain.push({
    userId: referrerUserId,
    level: 1,
    commissionPercentage: 20.00
  });

  // ✅ Level 2: Uses referrer.parentPartnerId
  if (referrer.parentPartnerId) {
    const level2User = await this.getUser(referrer.parentPartnerId);
    if (level2User) {
      referralChain.push({
        userId: level2User.id,
        level: 2,
        commissionPercentage: 10.00
      });
    }
  }

  // ✅ Insert into partner_hierarchy table
  for (const entry of referralChain) {
    await db.insert(partnerHierarchy).values({
      childId: newUserId,
      parentId: entry.userId,
      level: entry.level,
    });
  }

  // ✅ Update users table with parent_partner_id
  await db
    .update(users)
    .set({
      parentPartnerId: referrerUserId,  // ✅ SETS parent_partner_id
      referralCode: referralCodeToSet,
      partnerLevel,
      updatedAt: new Date(),
    })
    .where(eq(users.id, newUserId));

  console.log(`Referral hierarchy set up for user ${newUserId} with referrer ${referrerUserId}. Chain length: ${referralChain.length}`);
}
```

**✅ USES:** `users.parentPartnerId` + `partner_hierarchy` table  
**✅ FIELDS SET:**
- `users.parent_partner_id` = referrer's ID
- `partner_hierarchy.child_id` = new user
- `partner_hierarchy.parent_id` = referrer (and referrer's referrer)
- `partner_hierarchy.level` = 1, 2

**✅ STATUS:** WORKING CORRECTLY

---

## STEP 2: DEALS SCHEMA

**File:** `shared/schema.ts` (Lines 117-170)

```typescript
export const deals = pgTable("deals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dealId: varchar("deal_id"),
  
  // ✅ WHO SUBMITTED THIS DEAL
  referrerId: varchar("referrer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  businessName: varchar("business_name").notNull(),
  businessEmail: varchar("business_email").notNull(),
  businessPhone: varchar("business_phone"),
  businessAddress: text("business_address"),
  businessTypeId: varchar("business_type_id").references(() => businessTypes.id, { onDelete: "set null" }),
  
  // MLM level tracking (LEGACY - NOT USED BY NEW SYSTEM)
  referralLevel: integer("referral_level").notNull().default(1),
  parentReferrerId: varchar("parent_referrer_id").references(() => users.id, { onDelete: "set null" }),
  commissionPercentage: decimal("commission_percentage", { precision: 5, scale: 2 }).notNull().default("60.00"),
  
  // Commission tracking
  estimatedCommission: decimal("estimated_commission", { precision: 10, scale: 2 }),
  actualCommission: decimal("actual_commission", { precision: 10, scale: 2 }),
  
  status: varchar("status").notNull().default("submitted"),
  dealStage: varchar("deal_stage").notNull().default("quote_request_received"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("deals_referrer_id_idx").on(table.referrerId),  // ✅ INDEXED
  index("deals_status_idx").on(table.status),
  index("deals_deal_stage_idx").on(table.dealStage),
  index("deals_submitted_at_idx").on(table.submittedAt),
  index("deals_referrer_status_idx").on(table.referrerId, table.status),
]);
```

**✅ WHO SUBMITTED THE DEAL:** `referrerId` (links to `users.id`)  
**❌ NO `userId` FIELD EXISTS**

---

## STEP 3: USERS SCHEMA

**File:** `shared/schema.ts` (Lines 31-93)

```typescript
export const users: any = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  
  // ✅ REFERRAL FIELDS (ACTUAL SCHEMA):
  partnerId: varchar("partner_id").unique(),
  parentPartnerId: varchar("parent_partner_id").references((): any => users.id, { onDelete: "set null" }),  // ✅ EXISTS
  referralCode: varchar("referral_code").unique(),
  partnerLevel: integer("partner_level").default(1),
  
  // ❌ NO "referredBy" FIELD EXISTS!
  
  teamRole: varchar("team_role").default("member"),
  teamId: varchar("team_id").references(() => teams.id, { onDelete: "set null" }),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("users_email_idx").on(table.email),
  index("users_partner_id_idx").on(table.partnerId),
  index("users_parent_partner_id_idx").on(table.parentPartnerId),  // ✅ INDEXED
  index("users_referral_code_idx").on(table.referralCode),
]);
```

**✅ FIELD EXISTS:** `parent_partner_id` (snake_case in DB) / `parentPartnerId` (camelCase in Drizzle)  
**❌ FIELD DOES NOT EXIST:** `referredBy` / `referred_by`

---

## STEP 4: PARTNER_HIERARCHY SCHEMA

**File:** `shared/schema.ts` (Lines 249-255)

```typescript
export const partnerHierarchy = pgTable("partner_hierarchy", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  childId: varchar("child_id").notNull(),   // ✅ The new user
  parentId: varchar("parent_id").notNull(), // ✅ Their referrer
  level: integer("level").notNull(),        // ✅ How many levels up (1 or 2)
  createdAt: timestamp("created_at").defaultNow(),
});
```

**Purpose:** Tracks multi-level referral chains for commission distribution  
**Used By:** `distributeCommissions()` function  
**Status:** ✅ WORKING CORRECTLY

---

## STEP 5: DEAL CREATION FLOW

**File:** `server/storage.ts` (Lines 1026-1050)

```typescript
async createDeal(dealData: InsertDeal): Promise<Deal> {
  const [deal] = await db
    .insert(deals)
    .values(dealData)  // ✅ dealData contains referrerId (from logged-in user)
    .returning();

  // Sync with Google Sheets
  try {
    let referrer = await this.getUser(deal.referrerId);  // ✅ Uses referrerId

    // Auto-generate partner ID if user doesn't have one
    if (referrer && !referrer.partnerId && referrer.firstName && referrer.lastName) {
      console.log('Generating partner ID for user:', referrer.id);
      await this.generatePartnerId(referrer.id);
      referrer = await this.getUser(deal.referrerId);
    }

    const businessType = await db.select().from(businessTypes).where(eq(businessTypes.id, deal.businessTypeId));

    if (referrer && businessType[0]) {
      const sheetData: DealSheetData = {
        partnerId: referrer.partnerId || 'No Partner ID',
        partnerName: `${referrer.firstName || ''} ${referrer.lastName || ''}`.trim() || 'Unknown',
        partnerEmail: referrer.email || '',
        businessName: deal.businessName,
        ...
      };
      
      await syncDealToSheets(sheetData);
    }
  } catch (error) {
    console.error('Error syncing to Google Sheets:', error);
  }

  return deal;
}
```

**✅ FIELD USED:** `deal.referrerId` = ID of user who submitted the deal  
**✅ PURPOSE:** Track who gets the 60% direct commission

---

## STEP 6: THE BROKEN `getTeamHierarchy()` Function

**File:** `server/storage.ts` (Lines 2421-2487)

```typescript
async getTeamHierarchy(userId: string): Promise<any[]> {
  try {
    // ❌ QUERIES NON-EXISTENT FIELD
    const directTeam = await db
      .select()
      .from(users)
      .where(eq(users.referredBy, userId));  // ❌ FIELD DOESN'T EXIST!

    const teamWithMetrics = await Promise.all(directTeam.map(async (member) => {
      // ❌ WRONG AGAIN
      const [teamSizeResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(users)
        .where(eq(users.referredBy, member.id));  // ❌ FIELD DOESN'T EXIST!

      // ❌ WRONG FIELD
      const [dealsResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(deals)
        .where(eq(deals.userId, member.id));  // ❌ Should be deals.referrerId

      return {
        id: member.id,
        email: member.email,
        firstName: member.firstName,
        lastName: member.lastName,
        createdAt: member.createdAt,
        referredBy: member.referredBy,  // ❌ FIELD DOESN'T EXIST!
        partnerLevel: 1,
        teamSize: Number(teamSizeResult?.count || 0),
        hasSubmittedDeals: Number(dealsResult?.count || 0),
        ...
      };
    }));

    return teamWithMetrics;
  } catch (error) {
    console.error("Error fetching team hierarchy:", error);
    return [];  // ❌ RETURNS EMPTY ARRAY DUE TO ERROR
  }
}
```

**❌ FIELD USED:** `users.referredBy` (DOESN'T EXIST)  
**❌ FIELD USED:** `deals.userId` (DOESN'T EXIST)  
**✅ SHOULD USE:** `users.parentPartnerId`  
**✅ SHOULD USE:** `deals.referrerId`

---

## 📊 FIELD USAGE SUMMARY

| System Component | Field Used | Status |
|------------------|------------|--------|
| **COMMISSION PAYMENTS** |
| `distributeCommissions()` | `partner_hierarchy` table | ✅ WORKING |
| `setupReferralHierarchy()` | `users.parentPartnerId` | ✅ WORKING |
| Commission lookup | `partner_hierarchy.childId/parentId` | ✅ WORKING |
| **DEALS** |
| Deal creation | `deals.referrerId` | ✅ WORKING |
| Who submitted deal | `deals.referrerId` | ✅ WORKING |
| **DASHBOARD (BROKEN)** |
| `getTeamHierarchy()` | `users.referredBy` ❌ | **BROKEN** |
| Team member count | `users.referredBy` ❌ | **BROKEN** |
| Deal count per user | `deals.userId` ❌ | **BROKEN** |

---

## 🎯 CRITICAL QUESTIONS ANSWERED

### 1. **What field does commission calculation use?**
✅ **Answer:** `partner_hierarchy` table with `childId`/`parentId` columns  
✅ **Secondary:** `users.parentPartnerId` to find level 2 upline

### 2. **What field does the team dashboard query use?**
❌ **Answer:** `users.referredBy` (DOESN'T EXIST - THIS IS THE BUG)

### 3. **Are they the SAME or DIFFERENT fields?**
**DIFFERENT SYSTEMS:**
- ✅ **Commission system** uses: `partner_hierarchy` table + `users.parentPartnerId`
- ❌ **Dashboard system** uses: Non-existent `users.referredBy` field

---

## 🛠️ SAFE FIX STRATEGY

Since commission system uses `partner_hierarchy` table and `users.parentPartnerId`, we have TWO OPTIONS:

### OPTION A: Fix Dashboard to Use `users.parentPartnerId`
```typescript
// Simple fix - use existing parent_partner_id field
const directTeam = await db
  .select()
  .from(users)
  .where(eq(users.parentPartnerId, userId));  // ✅ Use existing field
```

**Pros:**
- ✅ Uses existing schema
- ✅ No new tables
- ✅ Matches signup flow

**Cons:**
- ❌ Won't show nested team (only direct referrals)

### OPTION B: Use `partner_hierarchy` Table (RECOMMENDED)
```typescript
// Use the same system as commissions
const hierarchyEntries = await db
  .select()
  .from(partnerHierarchy)
  .where(eq(partnerHierarchy.parentId, userId));

// Then get user details for each childId
```

**Pros:**
- ✅ Consistent with commission system
- ✅ Can show multi-level team
- ✅ Uses indexed table

**Cons:**
- Slightly more complex query

---

## ✅ RECOMMENDATION

**Use OPTION A for immediate fix:**
- Replace `users.referredBy` → `users.parentPartnerId`
- Replace `deals.userId` → `deals.referrerId`

This will make the dashboard work immediately without affecting the commission system.

**Commission system remains untouched and working.**

---

**END OF VERIFICATION AUDIT**
