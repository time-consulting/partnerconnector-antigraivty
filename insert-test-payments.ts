/**
 * Test script to manually insert commission payment records
 * This tests if the UI displays them correctly
 */

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { users, deals, commissionPayments } from "./shared/schema";
import { eq, ilike, desc } from "drizzle-orm";
import 'dotenv/config';

async function insertTestPayments() {
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

    console.log("=== INSERTING TEST PAYMENT RECORDS ===\n");

    // 1. Find Lauren and Admin
    const laurenResult = await db.select().from(users).where(ilike(users.email, '%laurenfuller%'));
    const adminResult = await db.select().from(users).where(ilike(users.email, 'd.skeats@googlemail.com'));

    if (laurenResult.length === 0 || adminResult.length === 0) {
        console.log("❌ Could not find Lauren or Admin");
        await pool.end();
        return;
    }

    const lauren = laurenResult[0];
    const admin = adminResult[0];

    console.log(`Lauren: ${lauren.email} (ID: ${lauren.id})`);
    console.log(`Admin: ${admin.email} (ID: ${admin.id})`);

    // 2. Get a recent deal from Lauren
    const laurenDeals = await db
        .select()
        .from(deals)
        .where(eq(deals.referrerId, lauren.id))
        .orderBy(desc(deals.submittedAt))
        .limit(1);

    if (laurenDeals.length === 0) {
        console.log("❌ No deals found for Lauren");
        await pool.end();
        return;
    }

    const deal = laurenDeals[0];
    console.log(`\nUsing deal: ${deal.businessName} (ID: ${deal.id})`);

    // 3. Insert test payment for Lauren (Level 0 - 60%)
    console.log("\n\n📝 Inserting TEST payment for Lauren (Level 0 - 60%)...");
    try {
        const [laurenPayment] = await db.insert(commissionPayments).values({
            dealId: deal.id,
            recipientId: lauren.id,
            level: 0,
            amount: '600.00',
            percentage: '60.00',
            totalCommission: '1000.00',
            businessName: `TEST-${deal.businessName}`,
            paymentStatus: 'approved',
            approvalStatus: 'approved',
        }).returning();
        console.log(`   ✅ Created payment ID: ${laurenPayment.id}`);
    } catch (error: any) {
        console.log(`   ❌ Failed: ${error.message}`);
    }

    // 4. Insert test payment for Admin (Level 1 - 20%)
    console.log("\n📝 Inserting TEST payment for Admin (Level 1 - 20%)...");
    try {
        const [adminPayment] = await db.insert(commissionPayments).values({
            dealId: deal.id,
            recipientId: admin.id,
            level: 1,
            amount: '200.00',
            percentage: '20.00',
            totalCommission: '1000.00',
            businessName: `TEST-${deal.businessName}`,
            paymentStatus: 'approved',
            approvalStatus: 'approved',
        }).returning();
        console.log(`   ✅ Created payment ID: ${adminPayment.id}`);
    } catch (error: any) {
        console.log(`   ❌ Failed: ${error.message}`);
    }

    // 5. Verify what's in the table now
    console.log("\n\n📋 Verifying commission_payments table...");
    const allPayments = await db
        .select()
        .from(commissionPayments)
        .where(eq(commissionPayments.paymentStatus, 'approved'))
        .orderBy(desc(commissionPayments.createdAt));

    console.log(`\nFound ${allPayments.length} approved payments:`);
    for (const payment of allPayments) {
        const recipient = await db.select().from(users).where(eq(users.id, payment.recipientId));
        const recipientEmail = recipient.length > 0 ? recipient[0].email : 'UNKNOWN';
        console.log(`   Level ${payment.level}: £${payment.amount} -> ${recipientEmail} (${payment.businessName})`);
    }

    console.log("\n\n=== TEST COMPLETE ===");
    console.log("Now refresh the Payment Portal and check if BOTH cards appear!");
    console.log("(Look for entries with 'TEST-' in the business name)\n");

    await pool.end();
}

insertTestPayments().catch(console.error);
