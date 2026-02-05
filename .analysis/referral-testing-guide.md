# Referral System - Testing & Debugging Scripts

## 🧪 Manual Testing Guide

### Test 1: Get Your Referral Link

**Run in Browser Console (Team Management page):**
```javascript
// Method 1: From session
const user = await fetch('/api/user').then(r => r.json());
const referralLink = `${window.location.origin}/signup?ref=${user.referralCode}`;
console.log('🔗 Your Referral Link:', referralLink);
console.log('📋 Copy this link:', referralLink);
```

**Expected Output:**
```
🔗 Your Referral Link: http://localhost:5000/signup?ref=js001
📋 Copy this link: http://localhost:5000/signup?ref=js001
```

### Test 2: Verify Referral Code Exists

**Run in Server Console or API:**
```javascript
// In server/routes.ts or run via API testing tool
const user = await storage.getUserByReferralCode('js001');
console.log('User found:', user ? user.email : 'NOT FOUND');
```

**Expected Output:**
```
User found: john@example.com
```

### Test 3: Complete Referral Signup Flow

**Steps:**
1. Open **incognito/private window**
2. Navigate to: `http://localhost:5000/signup?ref=js001`
3. **VERIFY** banner shows: "Joining with referral code: JS001"
4. Fill out signup form:
   - Email: `test123@example.com`
   - Name: `Test User`
   - Password: `password123`
5. Click "Create Account"
6. **CHECK** server logs for:
```
[AUTH] Registration attempt: test123@example.com
[AUTH] Setting up referral hierarchy for: test123@example.com
[REFERRAL] Referrer found: john@example.com (abc-123)
Referral hierarchy set up for user def-456 with referrer abc-123
[PARTNER_ID] Generated tu001 for user def-456 (Test User)
```

### Test 4: Verify Database Link

**Run SQL Query:**
```sql
SELECT 
  new_user.id as new_user_id,
  new_user.email as new_user_email,
  new_user.partner_id as new_user_code,
  new_user.parent_partner_id,
  referrer.email as referrer_email,
  referrer.partner_id as referrer_code
FROM users new_user
LEFT JOIN users referrer ON new_user.parent_partner_id = referrer.id
WHERE new_user.email = 'test123@example.com';
```

**Expected Result:**
```
┌──────────────┬──────────────────────┬───────────────┬───────────────────┬──────────────────┬──────────────┐
│ new_user_id  │ new_user_email       │ new_user_code │ parent_partner_id │ referrer_email   │ referrer_code│
├──────────────┼──────────────────────┼───────────────┼───────────────────┼──────────────────┼──────────────┤
│ def-456      │ test123@example.com  │ tu001         │ abc-123           │ john@example.com │ js001        │
└──────────────┴──────────────────────┴───────────────┴───────────────────┴──────────────────┴──────────────┘
```

**✅ SUCCESS if:**
- `parent_partner_id` is NOT NULL
- `referrer_email` matches the owner of referral code "js001"

### Test 5: Check Team Dashboard

**Steps:**
1. Log in as original user (john@example.com)
2. Go to Team Management page
3. Should see +1 team member: "Test User (test123@example.com)"

**Run in Database:**
```sql
SELECT 
  u.email,
  u.partner_id,
  u.created_at
FROM users u
WHERE u.parent_partner_id = (
  SELECT id FROM users WHERE email = 'john@example.com'
);
```

## 🔍 Diagnostic SQL Queries

### Query 1: Find All Users and Their Referrers
```sql
SELECT 
  u.email as user_email,
  u.partner_id as user_code,
  u.parent_partner_id,
  p.email as referred_by,
  p.partner_id as referrer_code,
  u.created_at
FROM users u
LEFT JOIN users p ON u.parent_partner_id = p.id
ORDER BY u.created_at DESC
LIMIT 20;
```

### Query 2: Check Specific User's Downline
```sql
-- Replace 'john@example.com' with the user you want to check
SELECT 
  child.email as team_member,
  child.partner_id as their_code,
  child.partner_level as their_level,
  child.created_at as joined_at,
  (SELECT COUNT(*) FROM users WHERE parent_partner_id = child.id) as their_team_size
FROM users parent
JOIN users child ON child.parent_partner_id = parent.id
WHERE parent.email = 'john@example.com'
ORDER BY child.created_at DESC;
```

### Query 3: Verify Hierarchy Table
```sql
SELECT 
  ph.level,
  c.email as child,
  c.partner_id as child_code,
  p.email as parent,
  p.partner_id as parent_code,
  ph.created_at
FROM partner_hierarchy ph
JOIN users c ON ph.child_id = c.id
JOIN users p ON ph.parent_id = p.id
WHERE p.email = 'john@example.com'
ORDER BY ph.level, ph.created_at DESC;
```

### Query 4: Find Orphaned Users (No Referrer)
```sql
SELECT 
  email,
  partner_id,
  parent_partner_id,
  created_at
FROM users
WHERE parent_partner_id IS NULL
ORDER BY created_at DESC;
```

### Query 5: Check Referral Code Uniqueness
```sql
SELECT 
  referral_code,
  COUNT(*) as count
FROM users
WHERE referral_code IS NOT NULL
GROUP BY referral_code
HAVING COUNT(*) > 1;
```
*Should return 0 rows (all codes unique)*

## 🐛 Common Issues & Fixes

### Issue 1: "No team members showing up"

**Check 1:** Are they actually using the referral link?
```sql
SELECT 
  email,
  parent_partner_id,
  created_at
FROM users
WHERE created_at > NOW() - INTERVAL '7 days'
AND parent_partner_id IS NULL;
```
*These users signed up without a referral code*

**Fix:** Re-send the correct referral link with `?ref=` parameter

---

### Issue 2: "User signed up but not linked"

**Check 2:** Does the referral code exist in database?
```sql
SELECT id, email, referral_code 
FROM users 
WHERE referral_code = 'js001';
```

**If NULL/Not Found:**
- Referral code doesn't exist
- User might have typo in the link
- Need to regenerate referral code

**Fix:**
```sql
UPDATE users 
SET referral_code = partner_id 
WHERE email = 'john@example.com';
```

---

### Issue 3: "partner_id is NULL"

**Check 3:** Missing partner ID generation
```sql
SELECT id, email, partner_id, referral_code
FROM users
WHERE partner_id IS NULL;
```

**Fix:** Run partner ID generation
```javascript
// In server console or via API
await storage.generatePartnerId(userId);
```

---

### Issue 4: "Hierarchy not created"

**Check 4:** Missing hierarchy entries
```sql
SELECT ph.*, c.email as child, p.email as parent
FROM partner_hierarchy ph
JOIN users c ON ph.child_id = c.id  
JOIN users p ON ph.parent_id = p.id
WHERE c.email = 'test123@example.com';
```

**If 0 rows:**
- Hierarchy wasn't set up during signup
- Need to manually create

**Fix:**
```javascript
// Get user IDs first
const newUser = await storage.getUserByEmail('test123@example.com');
const referrer = await storage.getUserByReferralCode('js001');

// Setup hierarchy
await storage.setupReferralHierarchy(newUser.id, referrer.id);
```

## 📊 Analytics Queries

### Total Referrals per User
```sql
SELECT 
  p.email,
  p.partner_id,
  COUNT(c.id) as total_referrals,
  SUM(CASE WHEN c.created_at > NOW() - INTERVAL '30 days' THEN 1 ELSE 0 END) as last_30_days
FROM users p
LEFT JOIN users c ON c.parent_partner_id = p.id
GROUP BY p.id, p.email, p.partner_id
HAVING COUNT(c.id) > 0
ORDER BY total_referrals DESC;
```

### Multi-Level Breakdown
```sql
SELECT 
  p.email as partner,
  COUNT(CASE WHEN ph.level = 1 THEN 1 END) as level_1,
  COUNT(CASE WHEN ph.level = 2 THEN 1 END) as level_2,
  COUNT(CASE WHEN ph.level = 3 THEN 1 END) as level_3
FROM users p
LEFT JOIN partner_hierarchy ph ON ph.parent_id = p.id
GROUP BY p.id, p.email
HAVING COUNT(ph.id) > 0
ORDER BY level_1 DESC;
```

### Referral Conversion Rate
```sql
WITH referral_stats AS (
  SELECT 
    p.email,
    p.partner_id,
    COUNT(c.id) as total_signups,
    SUM(CASE WHEN c.has_completed_onboarding THEN 1 ELSE 0 END) as completed_onboarding,
    SUM(CASE WHEN EXISTS (
      SELECT 1 FROM deals WHERE referrer_id = c.id LIMIT 1
    ) THEN 1 ELSE 0 END) as submitted_deal
  FROM users p
  LEFT JOIN users c ON c.parent_partner_id = p.id
  GROUP BY p.id, p.email, p.partner_id
)
SELECT 
  email,
  partner_id,
  total_signups,
  completed_onboarding,
  submitted_deal,
  ROUND(100.0 * completed_onboarding / NULLIF(total_signups, 0), 1) as onboarding_rate,
  ROUND(100.0 * submitted_deal / NULLIF(total_signups, 0), 1) as deal_rate
FROM referral_stats
WHERE total_signups > 0
ORDER BY total_signups DESC;
```

## 🎯 Quick Health Check Script

**Run this SQL to verify system health:**
```sql
-- REFERRAL SYSTEM HEALTH CHECK
SELECT 
  'Total Users' as metric,
  COUNT(*) as count
FROM users
UNION ALL
SELECT 
  'Users with Referral Code',
  COUNT(*)
FROM users
WHERE referral_code IS NOT NULL
UNION ALL
SELECT 
  'Users with Parent (referred)',
  COUNT(*)
FROM users
WHERE parent_partner_id IS NOT NULL
UNION ALL
SELECT 
  'Total Hierarchy Entries',
  COUNT(*)
FROM partner_hierarchy
UNION ALL
SELECT 
  'Level 1 Relationships',
  COUNT(*)
FROM partner_hierarchy
WHERE level = 1
UNION ALL
SELECT 
  'Level 2 Relationships',
  COUNT(*)
FROM partner_hierarchy
WHERE level = 2
UNION ALL
SELECT 
  'Level 3 Relationships',
  COUNT(*)
FROM partner_hierarchy
WHERE level = 3;
```

**Expected Output:**
```
┌──────────────────────────────┬───────┐
│ metric                       │ count │
├──────────────────────────────┼───────┤
│ Total Users                  │ 150   │
│ Users with Referral Code     │ 150   │ ← Should match total
│ Users with Parent (referred) │ 120   │ ← 30 are root users
│ Total Hierarchy Entries      │ 200   │
│ Level 1 Relationships        │ 120   │
│ Level 2 Relationships        │ 60    │
│ Level 3 Relationships        │ 20    │
└──────────────────────────────┴───────┘
```

**🚨 RED FLAGS:**
- "Users with Referral Code" < "Total Users" → Some users missing codes
- "Total Hierarchy Entries" = 0 → Hierarchy not being created
- "Level 1" + "Level 2" + "Level 3" ≠ "Total Hierarchy" → Data inconsistency

## 🔧 Repair Scripts

### Repair Script 1: Generate Missing Referral Codes
```sql
-- Find users without referral codes
SELECT id, email, first_name, last_name
FROM users
WHERE referral_code IS NULL
OR partner_id IS NULL;
```

**Then run in server:**
```javascript
const usersToFix = await db.select().from(users).where(isNull(users.referralCode));
for (const user of usersToFix) {
  await storage.generatePartnerId(user.id);
  console.log(`Fixed ${user.email}`);
}
```

### Repair Script 2: Rebuild Hierarchy for User
```javascript
// If hierarchy is missing but parent_partner_id exists
const user = await storage.getUserByEmail('test@example.com');
if (user.parentPartnerId) {
  await storage.setupReferralHierarchy(user.id, user.parentPartnerId);
  console.log(`Rebuilt hierarchy for ${user.email}`);
}
```

## 📝 Summary Checklist

**For each new signup with referral:**

- [ ] URL contains `?ref=XXXXX`
- [ ] Signup form shows referral code badge
- [ ] Server logs show referral setup
- [ ] `users.parent_partner_id` is set
- [ ] `partner_hierarchy` has at least 1 entry
- [ ] Team dashboard shows +1 member
- [ ] Commission tracking includes new user

**If ANY checkbox fails, the referral link wasn't used correctly!**
