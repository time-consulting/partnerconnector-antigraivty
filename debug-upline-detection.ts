/**
 * Debug script to check upline detection for Lauren
 */

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { users, deals, partnerHierarchy, commissionPayments, commissionApprovals } from "./shared/schema";
import { eq, ilike, desc } from "drizzle-orm";
import 'dotenv/config';

async function debug() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false }
    });
    const db = drizzle(pool);

    console.log("=== DEBUG UPLINE DETECTION ===\n");

    // 1. Find Lauren
    console.log("STEP 1: Finding Lauren...\n");
    const laurenResult = await db
        .select()
        .from(users)
        .where(ilike(users.email, '%laurenfuller%'));

    if (laurenResult.length === 0) {
        console.log("❌ Lauren not found!");
        await pool.end();
        return;
    }

    const lauren = laurenResult[0];
    console.log(`✅ Found Lauren: ${lauren.email}`);
    console.log(`   ID: ${lauren.id}`);
    console.log(`   Parent Partner ID: ${lauren.parentPartnerId || 'NULL'}`);

    // 2. Check if parent exists
    if (lauren.parentPartnerId) {
        const parent = await db
            .select()
            .from(users)
            .where(eq(users.id, lauren.parentPartnerId));

        if (parent.length > 0) {
            console.log(`   Parent: ${parent[0].firstName} ${parent[0].lastName} (${parent[0].email})`);
        } else {
            console.log(`   ⚠️ Parent ID set but user not found!`);
        }
    } else {
        console.log(`   ⚠️ Lauren has NO parentPartnerId - this is why upline isn't detected!`);
    }

    // 3. Check partner_hierarchy for Lauren
    console.log("\n\nSTEP 2: Checking partner_hierarchy for Lauren...\n");
    const hierarchyEntries = await db
        .select()
        .from(partnerHierarchy)
        .where(eq(partnerHierarchy.childId, lauren.id));

    if (hierarchyEntries.length === 0) {
        console.log("❌ No entries in partner_hierarchy for Lauren");
        console.log("   This means upline lookups will fall back to parentPartnerId chain");
    } else {
        console.log(`Found ${hierarchyEntries.length} hierarchy entries:`);
        for (const entry of hierarchyEntries) {
            const parentUser = await db
                .select()
                .from(users)
                .where(eq(users.id, entry.parentId));
            const parentName = parentUser.length > 0
                ? `${parentUser[0].firstName} ${parentUser[0].lastName} (${parentUser[0].email})`
                : 'UNKNOWN';
            console.log(`   Level ${entry.level}: ${parentName}`);
        }
    }

    // 4. Check recent commission payments
    console.log("\n\nSTEP 3: Checking recent commission payments...\n");
    const recentPayments = await db
        .select()
        .from(commissionPayments)
        .orderBy(desc(commissionPayments.createdAt))
        .limit(10);

    console.log(`Found ${recentPayments.length} recent commission payments:`);
    for (const payment of recentPayments) {
        const recipient = await db.select().from(users).where(eq(users.id, payment.recipientId));
        const recipientName = recipient.length > 0 ? recipient[0].email : 'UNKNOWN';
        console.log(`   Deal: ${payment.dealId?.slice(0, 8)}... Level ${payment.level}: £${payment.amount} -> ${recipientName} (Status: ${payment.paymentStatus})`);
    }

    // 5. Check recent commission approvals
    console.log("\n\nSTEP 4: Checking recent commission approvals...\n");
    const recentApprovals = await db
        .select()
        .from(commissionApprovals)
        .orderBy(desc(commissionApprovals.createdAt))
        .limit(10);

    console.log(`Found ${recentApprovals.length} recent commission approvals:`);
    for (const approval of recentApprovals) {
        const recipient = await db.select().from(users).where(eq(users.id, approval.userId));
        const recipientName = recipient.length > 0 ? recipient[0].email : 'UNKNOWN';
        console.log(`   Deal: ${approval.dealId?.slice(0, 8)}... Level ${approval.level}: £${approval.commissionAmount} -> ${recipientName} (Type: ${approval.commissionType})`);
    }

    // 6. Check Lauren's deals
    console.log("\n\nSTEP 5: Checking Lauren's deals...\n");
    const laurenDeals = await db
        .select()
        .from(deals)
        .where(eq(deals.referrerId, lauren.id))
        .orderBy(desc(deals.submittedAt))
        .limit(5);

    console.log(`Found ${laurenDeals.length} deals for Lauren:`);
    for (const deal of laurenDeals) {
        console.log(`   ${deal.businessName} (Stage: ${deal.dealStage})`);
        console.log(`   Parent Referrer ID: ${deal.parentReferrerId || 'NULL'}`);
    }

    console.log("\n=== DEBUG COMPLETE ===\n");
    await pool.end();
}

debug().catch(console.error);
