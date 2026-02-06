# 🔍 COMPREHENSIVE DASHBOARD & REFERRAL SYSTEM AUDIT
**Generated:** 2026-02-06  
**Database:** PostgreSQL via Drizzle ORM

---

## 🚨 **EXECUTIVE SUMMARY: BROKEN LINK IDENTIFIED**

**Problem:** Team Members count shows 0 on Main Dashboard even when users sign up with referral code.

**Root Cause:** **CRITICAL MISMATCH** between database schema field names:
- **Signup flow** uses `parentPartnerId` (correct)  
- **Team analytics query** uses `referredBy` (**WRONG FIELD - DOESN'T EXIST IN SCHEMA**)

**Impact:** Dashboard queries return empty arrays because they're querying a non-existent field.

---

## STEP 1: FRONTEND COMPONENTS MAP

### A) MAIN DASHBOARD
**File:** `client/src/pages/dashboard.tsx`

#### Team Members Card (Lines 123-132):
```typescript
<div className="rocket-card p-5" data-testid="card-team-members">
  <div className="rocket-icon-box mb-4">
    <Users className="w-5 h-5" />
  </div>
  <h3 className="text-cyan-400 font-semibold mb-1">Team Members</h3>
  <p className="text-gray-500 text-sm mb-2">Partners in your network</p>
  <div className="text-3xl font-bold text-white" data-testid="text-team-count">
    {teamLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : teamMembers.length}
  </div>
</div>
```

#### API Call (Lines 46-51):
```typescript
const { data: teamData, isLoading: teamLoading } = useQuery({
  queryKey: ["/api/team-analytics"],
  enabled: isAuthenticated,
});

const teamMembers = teamData?.teamMembers || [];
```

**✅ Endpoint Called:** `/api/team-analytics`  
**❌ Returns:** Empty `teamMembers` array (0 length)

---

### B) TEAM OVERVIEW WIDGET
**File:** `client/src/pages/dashboard.tsx` (Lines 237-242)

```typescript
) : teamMembers.length === 0 ? (
  <div className="text-center p-6">
    <Users className="w-8 h-8 text-gray-500 mx-auto mb-2" />
    <p className="text-gray-500 text-sm">No team members yet</p>
    <p className="text-gray-600 text-xs">Invite partners to grow your network</p>
  </div>
```

**Uses:** Same `teamData?.teamMembers` from `/api/team-analytics`

---

### C) TEAM DASHBOARD PAGE
**File:** `client/src/pages/team-management.tsx`

#### API Calls (Lines 122-129):
```typescript
const { data: referralStats, isLoading: isLoadingStats, refetch: refetchStats } = useQuery<InviteMetrics>({
  queryKey: ['/api/team/referral-stats'],
  enabled: isAuthenticated,
});

const { data: referrals = [], isLoading: isLoadingReferrals, refetch: refetchReferrals } = useQuery({
  queryKey: ['/api/team/referrals'],
  enabled: isAuthenticated,
});
```

**✅ Endpoints Called:**
- `/api/team/referral-stats` → Returns active/inactive counts
- `/api/team/referrals` → Returns team member list

---

### D) ADMIN DASHBOARD
**File:** `client/src/pages/admin-backend.tsx`

#### Endpoints:
- `/api/admin/analytics` → Platform-wide stats
- `/api/admin/user-stats` → Total/active/inactive users

---

## STEP 2: BACKEND API ENDPOINTS

### `/api/team-analytics` (Lines 2313-2361)

```typescript
app.get('/api/team-analytics', requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;

    // Get team members under this user (direct and indirect)
    const teamMembers = await storage.getTeamHierarchy(userId);  // ⚠️ CALLS getTeamHierarchy

    // Calculate performance metrics
    const totalTeamMembers = teamMembers.length;
    const totalRevenue = teamMembers.reduce((sum, m) => sum + (m.totalRevenue || 0), 0);
    const activeMembers = teamMembers.filter(m => m.hasSubmittedDeals > 0).length;
    
    const formattedMembers = teamMembers.map((member, index) => ({
      id: member.id,
      name: `${member.firstName} ${member.lastName}`,
      email: member.email,
      level: member.partnerLevel === 1 ? "Direct Team (L1)" : member.partnerLevel === 2 ? "Extended Team (L2)" : "Network (L3)",
      rank: index + 1,
      totalInvites: member.teamSize || 0,
      ...
    }));

    res.json({
      performanceMetrics: { ... },
      teamMembers: formattedMembers,  // ⚠️ THIS IS EMPTY!
      chartData: [],
    });
  } catch (error) {
    console.error("Error fetching team analytics:", error);
    res.status(500).json({ message: "Failed to fetch team analytics" });
  }
});
```

**Calls:** `storage.getTeamHierarchy(userId)`

---

### `/api/team/referral-stats` (Lines 2163-2172)

```typescript
app.get('/api/team/referral-stats', requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const stats = await storage.getTeamReferralStats(userId);  // ✅ FIXED VERSION
    res.json(stats);
  } catch (error) {
    console.error("Error fetching team referral stats:", error);
    res.status(500).json({ message: "Failed to fetch team referral stats" });
  }
});
```

**Calls:** `storage.getTeamReferralStats(userId)` ✅ Uses `parent_partner_id` (CORRECT)

---

## STEP 3: DATABASE SCHEMA

**File:** `shared/schema.ts` (Lines 31-93)

### Users Table:
```typescript
export const users: any = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  
  // ✅ REFERRAL FIELDS (CORRECT):
  partnerId: varchar("partner_id").unique(),
  parentPartnerId: varchar("parent_partner_id").references((): any => users.id, { onDelete: "set null" }), // For MLM structure
  referralCode: varchar("referral_code").unique(),
  partnerLevel: integer("partner_level").default(1),
  
  // ❌ NO "referredBy" FIELD EXISTS!
  
  teamRole: varchar("team_role").default("member"),
  teamId: varchar("team_id").references(() => teams.id, { onDelete: "set null" }),
  ...
}, (table) => [
  index("users_email_idx").on(table.email),
  index("users_partner_id_idx").on(table.partnerId),
  index("users_parent_partner_id_idx").on(table.parentPartnerId),  // ✅ INDEX EXISTS
  index("users_team_id_idx").on(table.teamId),
  index("users_referral_code_idx").on(table.referralCode),
]);
```

**Database:** PostgreSQL  
**Referral Field:** `parent_partner_id` (snake_case in DB)  
**Schema Reference:** `parentPartnerId` (camelCase in code)

---

## STEP 4: SIGNUP FLOW TRACE

### A) SIGNUP PAGE
**File:** `client/src/pages/signup.tsx`

#### Capturing ?ref Parameter (Lines 84-108):
```typescript
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const emailParam = params.get('email');
  const nameParam = params.get('name');
  const refCode = params.get('ref');  // ✅ CAPTURES REF CODE
  
  if (emailParam) {
    setFormData(prev => ({ ...prev, email: emailParam }));
    if (nameParam) {
      const nameParts = nameParam.split(' ');
      setFormData(prev => ({ 
        ...prev, 
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || ''
      }));
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }
  
  if (refCode) {
    setFormData(prev => ({ ...prev, referralCode: refCode.toUpperCase() }));  // ✅ STORES IN STATE
  }
}, []);
```

#### Submitting Registration (View full signup.tsx for complete code):
The form sends `referralCode` to `/api/auth/register`

---

### B) REGISTER API ENDPOINT
**File:** `server/routes.ts` (Lines 254-305)

```typescript
app.post('/api/auth/register', async (req: any, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      referralCode: z.string().optional(),  // ✅ ACCEPTS REFERRAL CODE
    });

    const data = schema.parse(req.body);
    const { email, password, firstName, lastName, referralCode } = data;

    console.log('[AUTH] Registration attempt:', email);

    // Create user with credentials
    const user = await storage.createUserWithCredentials(
      email,
      password,
      { firstName, lastName },
      referralCode || req.session.referralCode  // ✅ PASSES REFERRAL CODE
    );

    // Set session
    req.session.userId = user.id;

    // Clear referral code from session
    delete req.session.referralCode;

    console.log('[AUTH] Registration successful:', user.id, user.email);

    res.json({
      success: true,
      user: { ... }
    });
  } catch (error: any) {
    console.error('[AUTH] Registration error:', error);
    ...
  }
});
```

**✅ Receives:** `referral Code`  
**✅ Passes to:** `storage.createUserWithCredentials()`

---

### C) USER CREATION LOGIC
**File:** `server/storage.ts` (Lines 354-433)

```typescript
async createUserWithCredentials(
  email: string,
  password: string,
  userData: Partial<UpsertUser>,
  referralCode?: string
): Promise<User> {
  const bcrypt = await import('bcrypt');
  const crypto = await import('crypto');

  // Check if email already exists
  const existing = await this.getUserByEmail(email);
  if (existing) {
    throw new Error('Email already registered');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // In development, auto-verify emails
  const isDevelopment = process.env.NODE_ENV === 'development';
  const emailVerified = isDevelopment ? true : false;

  // Create user
  const [user] = await db.insert(users).values({
    email,
    passwordHash,
    emailVerified,
    verificationToken,
    ...userData,
  }).returning();

  console.log('[AUTH] New user created:', user.id, user.email);

  // ✅ Setup referral hierarchy if referral code provided
  let referrerPartnerId: string | undefined;
  if (referralCode) {
    console.log('[AUTH] Setting up referral hierarchy for:', user.email);
    try {
      const referrer = await this.getUserByReferralCode(referralCode);  // ✅ FINDS REFERRER
      if (referrer && referrer.id !== user.id) {
        referrerPartnerId = referrer.partnerId;
        await this.setupReferralHierarchy(user.id, referrer.id);  // ✅ SETS parent_partner_id
        console.log('[AUTH] Referral hierarchy created successfully');
      }
    } catch (error) {
      console.error('[AUTH] Error setting up referral hierarchy:', error);
    }
  }

  // Generate partner ID and referral code
  if (!user.partnerId || !user.referralCode) {
    await this.generatePartnerId(user.id, referrerPartnerId);
  }

  // Send verification email
  const { ghlEmailService } = await import('./ghlEmailService');
  await ghlEmailService.sendEmailVerification(
    user.email!,
    verificationToken,
    userData.firstName || undefined,
    userData.lastName || undefined
  );

  return await this.getUser(user.id) as User;
}
```

**✅ Calls:** `setupReferralHierarchy(newUserId, referrerId)`  
**✅ Result:** Sets `parent_partner_id` on new user

---

## STEP 5: ❌ THE BROKEN LINK

### `getTeamHierarchy()` Function
**File:** `server/storage.ts` (Lines 2421-2487)

```typescript
async getTeamHierarchy(userId: string): Promise<any[]> {
  // Get all team members referred by this user (direct and indirect, up to 3 levels)
  try {
    // ❌ BROKEN: Queries non-existent field "referredBy"
    const directTeam = await db
      .select()
      .from(users)
      .where(eq(users.referredBy, userId));  // ❌ FIELD DOESN'T EXIST!

    // Process team member data with additional metrics
    const teamWithMetrics = await Promise.all(directTeam.map(async (member) => {
      // Get team size for this member
      const [teamSizeResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(users)
        .where(eq(users.referredBy, member.id));  // ❌ WRONG AGAIN!

      // Get deals submitted by this member
      const [dealsResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(deals)
        .where(eq(deals.userId, member.id));  // ❌ ALSO WRONG - should be referrerId

      ...
    }));

    return teamWithMetrics;
  } catch (error) {
    console.error("Error fetching team hierarchy:", error);
    return [];  // ❌ RETURNS EMPTY ARRAY
  }
}
```

**Issues Found:**
1. ❌ Queries `users.referredBy` (field doesn't exist in schema)
2. ❌ Should query `users.parentPartnerId`
3. ❌ Queries `deals.userId` instead of `deals.referrerId`

---

## STEP 6: THE FIXES

### FIX 1: `getTeamHierarchy()` Function

**BEFORE (BROKEN):**
```typescript
async getTeamHierarchy(userId: string): Promise<any[]> {
  try {
    // ❌ WRONG FIELD
    const directTeam = await db
      .select()
      .from(users)
      .where(eq(users.referredBy, userId));

    const teamWithMetrics = await Promise.all(directTeam.map(async (member) => {
      // ❌ WRONG FIELD
      const [teamSizeResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(users)
        .where(eq(users.referredBy, member.id));

      // ❌ WRONG FIELD
      const [dealsResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(deals)
        .where(eq(deals.userId, member.id));

      ...
    }));

    return teamWithMetrics;
  } catch (error) {
    console.error("Error fetching team hierarchy:", error);
    return [];
  }
}
```

**AFTER (FIXED):**
```typescript
async getTeamHierarchy(userId: string): Promise<any[]> {
  try {
    // ✅ CORRECT: Use parentPartnerId
    const directTeam = await db
      .select()
      .from(users)
      .where(eq(users.parentPartnerId, userId));

    const teamWithMetrics = await Promise.all(directTeam.map(async (member) => {
      // ✅ CORRECT: Use parentPartnerId
      const [teamSizeResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(users)
        .where(eq(users.parentPartnerId, member.id));

      // ✅ CORRECT: Use referrerId
      const [dealsResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(deals)
        .where(eq(deals.referrerId, member.id));

      // ✅ CORRECTED RETURN OBJECT
      return {
        id: member.id,
        email: member.email,
        firstName: member.firstName,
        lastName: member.lastName,
        createdAt: member.createdAt,
        parentPartnerId: member.parentPartnerId,  // ✅ Changed from referredBy
        partnerLevel: 1,
        teamSize: Number(teamSizeResult?.count || 0),
        activeTeamMembers: 0,
        hasSubmittedDeals: Number(dealsResult?.count || 0),
        totalRevenue: Number(revenueResult?.total || 0),
        monthlyRevenue: Number(monthlyResult?.total || 0),
        lastActiveAt: null
      };
    }));

    return teamWithMetrics;
  } catch (error) {
    console.error("Error fetching team hierarchy:", error);
    return [];
  }
}
```

**What Changed:**
1. ✅ `users.referredBy` → `users.parentPartnerId` (3 locations)
2. ✅ `deals.userId` → `deals.referrerId`
3. ✅ `referredBy` field in return object → `parentPartnerId`

---

## 📋 SUMMARY OF BROKEN LINKS

| #  | Location | Issue | Status |
|----|----------|-------|--------|
| ✅ | Frontend signup | Captures ?ref= parameter | WORKING |
| ✅ | Frontend signup | Sends referralCode to API | WORKING |
| ✅ | POST /api/auth/register | Accepts referralCode | WORKING |
| ✅ | createUserWithCredentials() | Calls setupReferralHierarchy() | WORKING |
| ✅ | setupReferralHierarchy() | Sets parent_partner_id | WORKING |
| ❌ | getTeamHierarchy() | Queries wrong field (referredBy) | **BROKEN** |
| ✅ | getTeamReferralStats() | Uses parent_partner_id (after fix) | **FIXED** |
| ❌ | /api/team-analytics | Returns empty teamMembers array | **BROKEN** |
| ✅ | /api/team/referral-stats | Returns correct counts | WORKING |

---

## 🎯 ACTION ITEMS

### IMMEDIATE FIX REQUIRED:
1. **Update `getTeamHierarchy()` in `server/storage.ts`**
   - Replace all `users.referredBy` with `users.parentPartnerId`
   - Replace `deals.userId` with `deals.referrerId`
   - Update return object field name

### TESTING CHECKLIST:
- [ ] User7 signs up with User1's referral code
- [ ] User7's `parent_partner_id` is set to User1's ID
- [ ] User1's dashboard shows "Team Members: 1"
- [ ] User1's "Team Overview" widget lists User7
- [ ] `/api/team-analytics` returns non-empty `teamMembers` array

---

**END OF AUDIT**
