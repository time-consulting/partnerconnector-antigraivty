/**
 * Database Cleanup Script
 * This removes all test users and keeps only the admin account
 * 
 * Run with: npx tsx cleanup-test-users.ts
 */

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { users, deals, partnerHierarchy, commissionPayments, commissionApprovals, paymentSplits, teamInvitations } from "./shared/schema";
import { eq, ne, or, ilike, and, notIlike, sql } from "drizzle-orm";
import 'dotenv/config';

let pool: Pool;

async function cleanup() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }

    pool = new Pool({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false }
    });
    const db = drizzle(pool);

    console.log("=== DATABASE CLEANUP - REMOVE TEST USERS ===\n");

    // 1. Find the admin account(s)
    console.log("STEP 1: Finding admin account...\n");

    const adminAccounts = await db
        .select()
        .from(users)
        .where(
            or(
                ilike(users.email, 'd.skeats@gmail.com'),
                ilike(users.email, 'd.skeats@googlemail.com')
            )
        );

    if (adminAccounts.length === 0) {
        console.error("❌ Admin account not found!");
        await pool.end();
        process.exit(1);
    }

    console.log(`Found ${adminAccounts.length} admin account(s):`);
    for (const admin of adminAccounts) {
        console.log(`   - ${admin.email} (ID: ${admin.id})`);
        console.log(`     Name: ${admin.firstName || 'NULL'} ${admin.lastName || 'NULL'}`);
        console.log(`     IsAdmin: ${admin.isAdmin}`);
    }

    // Use the first admin account as the main one
    const mainAdmin = adminAccounts[0];
    console.log(`\n   Using ${mainAdmin.email} as the main admin account\n`);

    // 2. Get all users except admin
    console.log("STEP 2: Counting users to remove...\n");

    const allUsers = await db.select().from(users);
    const usersToRemove = allUsers.filter(u =>
        !u.email?.toLowerCase().includes('d.skeats@gmail') &&
        !u.email?.toLowerCase().includes('d.skeats@googlemail')
    );

    console.log(`   Total users in database: ${allUsers.length}`);
    console.log(`   Users to KEEP (admin): ${adminAccounts.length}`);
    console.log(`   Users to REMOVE: ${usersToRemove.length}`);

    if (usersToRemove.length > 0) {
        console.log("\n   Users that will be removed:");
        for (const u of usersToRemove) {
            console.log(`      - ${u.email} (${u.firstName} ${u.lastName})`);
        }
    }

    // 3. Clear admin's parentPartnerId
    console.log("\n\nSTEP 3: Clearing admin's parentPartnerId...\n");

    await db
        .update(users)
        .set({
            parentPartnerId: null,
            firstName: 'Darren',
            lastName: 'Skeats',
            isAdmin: true,
            updatedAt: new Date()
        })
        .where(eq(users.id, mainAdmin.id));

    console.log(`   ✅ Cleared parentPartnerId for ${mainAdmin.email}`);
    console.log(`   ✅ Set name to 'Darren Skeats'`);
    console.log(`   ✅ Ensured isAdmin = true`);

    // 4. Clear partner_hierarchy table completely
    console.log("\n\nSTEP 4: Clearing partner_hierarchy table...\n");

    const hierarchyCount = await db.select({ count: sql<number>`count(*)` }).from(partnerHierarchy);
    console.log(`   Entries to delete: ${hierarchyCount[0]?.count || 0}`);

    await db.delete(partnerHierarchy);
    console.log("   ✅ Cleared partner_hierarchy table");

    // 5. Clear commission data for non-admin users
    console.log("\n\nSTEP 5: Clearing commission data for test users...\n");

    // Delete commission payments for users being removed
    const userIdsToRemove = usersToRemove.map(u => u.id);

    if (userIdsToRemove.length > 0) {
        // We need to be careful here - only delete commissions linked to test users
        // For now, let's just clear all commission data since we're starting fresh

        const commissionsDeleted = await db.delete(commissionPayments).returning();
        console.log(`   ✅ Deleted ${commissionsDeleted.length} commission payment records`);

        const approvalsDeleted = await db.delete(commissionApprovals).returning();
        console.log(`   ✅ Deleted ${approvalsDeleted.length} commission approval records`);

        const splitsDeleted = await db.delete(paymentSplits).returning();
        console.log(`   ✅ Deleted ${splitsDeleted.length} payment split records`);
    }

    // 6. Clear team invitations
    console.log("\n\nSTEP 6: Clearing team invitations...\n");

    const invitesDeleted = await db.delete(teamInvitations).returning();
    console.log(`   ✅ Deleted ${invitesDeleted.length} team invitation records`);

    // 7. Update deals to remove references to deleted users
    console.log("\n\nSTEP 7: Updating deals...\n");

    // Set parentReferrerId to null for all deals
    await db
        .update(deals)
        .set({ parentReferrerId: null });
    console.log("   ✅ Cleared parentReferrerId on all deals");

    // Update deals to point to admin if they were created by test users
    // (Or we could delete those deals - depends on what you want)
    const dealsWithTestUsers = await db
        .select()
        .from(deals)
        .where(
            and(
                ...userIdsToRemove.map(id => ne(deals.referrerId, id))
            )
        );

    console.log(`   Deals owned by admin: ${dealsWithTestUsers.length}`);

    // 8. Delete test users
    console.log("\n\nSTEP 8: Deleting test users...\n");

    if (usersToRemove.length === 0) {
        console.log("   No test users to delete");
    } else {
        // Delete users one by one to handle foreign key constraints
        let deletedCount = 0;
        for (const u of usersToRemove) {
            try {
                // First, reassign any deals they created to admin
                await db
                    .update(deals)
                    .set({ referrerId: mainAdmin.id })
                    .where(eq(deals.referrerId, u.id));

                // Delete the user
                await db.delete(users).where(eq(users.id, u.id));
                deletedCount++;
                console.log(`   ✅ Deleted: ${u.email}`);
            } catch (error: any) {
                console.log(`   ⚠️ Could not delete ${u.email}: ${error.message}`);
            }
        }
        console.log(`\n   Deleted ${deletedCount}/${usersToRemove.length} test users`);
    }

    // 9. Verification
    console.log("\n\n=== VERIFICATION ===\n");

    const remainingUsers = await db.select().from(users);
    console.log(`Remaining users: ${remainingUsers.length}`);
    for (const u of remainingUsers) {
        console.log(`   - ${u.email}`);
        console.log(`     ID: ${u.id}`);
        console.log(`     Name: ${u.firstName} ${u.lastName}`);
        console.log(`     IsAdmin: ${u.isAdmin}`);
        console.log(`     ParentPartnerId: ${u.parentPartnerId || 'NULL (correct for admin)'}`);
        console.log(`     ReferralCode: ${u.referralCode}`);
        console.log();
    }

    const remainingDeals = await db.select().from(deals);
    console.log(`Remaining deals: ${remainingDeals.length}`);

    console.log("\n=== CLEANUP COMPLETE ===\n");
    console.log("You can now invite real users using your referral code.");
    console.log("New users will be properly linked to your account as their parent.\n");

    await pool.end();
}

cleanup().catch(async (error) => {
    console.error("Cleanup failed:", error);
    if (pool) await pool.end();
    process.exit(1);
});
