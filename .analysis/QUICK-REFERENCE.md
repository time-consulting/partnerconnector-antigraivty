# 🔖 Referral System - Quick Reference Card

## Database Fields (users table)

```
┌────────────────────┬─────────────────────┬─────────────────────────────┐
│ Field              │ Type                │ Purpose                     │
├────────────────────┼─────────────────────┼─────────────────────────────┤
│ id                 │ varchar (UUID)      │ Unique user ID              │
│ partnerId          │ varchar (unique)    │ "js001" - My partner ID     │
│ referralCode       │ varchar (unique)    │ "js001" - Same as partnerId │
│ parentPartnerId    │ varchar (FK)        │ **WHO REFERRED ME**         │
│ partnerLevel       │ integer (1-3)       │ Tier in hierarchy           │
└────────────────────┴─────────────────────┴─────────────────────────────┘
```

## 🔑 THE KEY FIELD

**`parentPartnerId`** = Foreign key to `users.id` of the person who referred you

```sql
-- Get my team members:
SELECT * FROM users WHERE parent_partner_id = {my_id};

-- Get my referrer:
SELECT * FROM users WHERE id = {my_parent_partner_id};
```

## 📝 Code Locations

```
SIGNUP FORM:
  └─ client/src/pages/signup.tsx (line 88) - Captures ?ref=

API ENDPOINT:
  └─ server/routes.ts (line 254) - POST /api/auth/register

USER CREATION:
  └─ server/storage.ts (line 354) - createUserWithCredentials()

LINKING LOGIC:
  └─ server/storage.ts (line 532) - setupReferralHierarchy()
  └─ server/storage.ts (line 599) - UPDATE parentPartnerId

CODE GENERATION:
  └─ server/storage.ts (line 1349) - generatePartnerId()

TEAM QUERY:
  └─ server/storage.ts (line 2270) - getTeamReferrals()
```

## 🚀 Quick Test

```bash
# 1. Get your referral code
SELECT referral_code FROM users WHERE email = 'you@example.com';
# Result: js001

# 2. Share this link
# https://yoursite.com/signup?ref=js001

# 3. After someone signs up, verify
SELECT 
  email, 
  parent_partner_id 
FROM users 
WHERE email = 'newuser@example.com';
# parent_partner_id should be YOUR user.id
```

## ✅ Working Correctly If:

1. New user's `parent_partner_id` = Your `id`
2. Entry in `partner_hierarchy` table exists
3. Team dashboard shows +1 member
4. Server logs show "Referral hierarchy set up"

## ❌ Not Working If:

1. `parent_partner_id` is NULL
2. No `partner_hierarchy` entry
3. Team dashboard unchanged
4. User didn't use `/signup?ref=CODE` link

## 🔧 Fix Missing Link

```sql
-- Set parent manually
UPDATE users 
SET parent_partner_id = '{your-user-id}'
WHERE email = 'newuser@example.com';

-- Then rebuild hierarchy
-- Run in server console:
-- await storage.setupReferralHierarchy(newUserId, yourUserId);
```

## 📊 Useful Queries

```sql
-- My team:
SELECT * FROM users WHERE parent_partner_id = '{my-id}';

-- My referral code:
SELECT referral_code FROM users WHERE id = '{my-id}';

-- Who referred me:
SELECT p.* FROM users p
JOIN users c ON c.parent_partner_id = p.id
WHERE c.id = '{my-id}';

-- Full hierarchy:
SELECT * FROM partner_hierarchy WHERE parent_id = '{my-id}';
```

## 🎯 Flow Summary

```
User A                  User B                  Database
  │                       │                       │
  ├─ referralCode: js001  │                       │
  ├─ Share link ─────────►│                       │
  │   /signup?ref=js001   │                       │
  │                       ├─ Fill form            │
  │                       ├─ Submit ─────────────►│
  │                       │                       ├─ Create User B
  │                       │                       ├─ Lookup "js001"
  │                       │                       ├─ Find User A
  │                       │                       ├─ SET parentPartnerId = A.id
  │◄────── Team +1 member │◄── Success ──────────┤
```

## 💡 Remember

- **`referralCode`** = What I share with others
- **`parentPartnerId`** = Who referred me
- **`partnerId`** = My unique ID (same as referralCode)
- **`partner_hierarchy`** = Multi-level tracking for commissions

## 🐛 Debug Command

```sql
-- Health check:
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM users WHERE parent_partner_id IS NOT NULL) as referred_users,
  (SELECT COUNT(*) FROM partner_hierarchy) as hierarchy_entries;
```

Expected: `referred_users` < `total_users` (some are root)

---

**Full docs in `.analysis/` folder:**
- `REFERRAL-SYSTEM-SUMMARY.md` - Executive summary
- `referral-system-debug.md` - Complete technical breakdown
- `referral-system-visual.md` - Diagrams and examples
- `referral-testing-guide.md` - SQL queries and test scripts
