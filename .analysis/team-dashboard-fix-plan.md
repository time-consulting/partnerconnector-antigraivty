# Team Dashboard - Real Data Implementation Plan

## 🔍 Investigation Results

### ✅ Referral Flow is Working Correctly
The backend correctly:
1. Captures referral code from signup (signup.tsx line 88, 106, 206)  
2. Sends to `/api/auth/register` endpoint (routes.ts line 254)
3. Looks up referrer user by referral code (storage.ts getUserByReferralCode)
4. Sets `parentPartnerId` on new user (storage.ts setupReferralHierarchy line 68-74)
5. Creates 3-level hierarchy in `partner_hierarchy` table

### ❌ Frontend Issues Found

**File:** `client/src/pages/team-management.tsx`

1. **Hardcoded XP System** (lines 208-219)
   - `const currentXP = 1250;` - Should calculate from real metrics
   - `const levels = [...]` - Static level definitions
   
2. **Hardcoded Growth %** (line 292)
   - `<span>+12%</span>` - Should calculate month-over-month growth

3. **Missing teamMembers Count** (line 269)
   - Frontend expects `inviteMetrics.teamMembers`
   - Backend only returns `{ sent, opened, clicked, registered, active }`

## 🛠️ Implementation Steps

### Step 1: Update Backend - Add Missing Fields

**File:** `server/storage.ts`

**Function:** `getTeamReferralStats`
- Add `teamMembers: result.total` to return object
- This represents total count of users where `parentPartnerId = userId`

### Step 2: Update Backend - Add XP Calculation

**Function:** `getProgressionData`
- Calculate XP from real metrics:
  - Base XP = 100 per completed deal
  - Team XP = 50 per active team member  
  - Revenue XP = 1 XP per £10 revenue
- Return `currentXP` and `xpToNextLevel` in response

### Step 3: Update Backend - Add Growth Calculation

**Function:** `getProgressionData`
- Query revenue from last 30 days vs previous 30 days
- Calculate percentage growth
- Return `revenueGrowthPercent` in response

### Step 4: Update Frontend - Remove Mock Data

**File:** `client/src/pages/team-management.tsx`

**Changes:**
1. Remove hardcoded `currentXP = 1250` (line 216)
2. Get XP from `progressionData.currentXP`
3. Get growth % from `progressionData.revenueGrowthPercent` (line 292)
4. Update `inviteMetrics` to use backend's `teamMembers` field (line 269)

### Step 5: Testing

1. Sign up new user with referral code
2. Check they appear in team dashboard
3. Verify XP calculation is based on real data
4. Verify growth % shows real calculation

## 📊 Data Flow

```
Signup with ref=PARTNER123
  ↓
Backend: getUserByReferralCode("PARTNER123")
  ↓
Backend: setupReferralHierarchy(newUser.id, referrer.id)
  ↓
DB: UPDATE users SET parent_partner_id = referrer.id WHERE id = newUser.id
  ↓
Team Dashboard: GET /api/team/referral-stats
  ↓
Query: SELECT COUNT(*) FROM users WHERE parent_partner_id = currentUser.id
  ↓
Frontend: Display team members count
```

## 🎯 Expected Outcomes

1. **Team members show real count** from database
2. **XP calculated** from deals + team size + revenue
3. **Growth % calculated** from month-over-month revenue
4. **No hardcoded mock data** anywhere in dashboard
5. **Referral signups tracked** correctly in team
