/**
 * Seed script to create 5 test deals for Lauren at "needs_approval" stage
 * This populates the Payment Portal with test data for testing the commission flow
 * 
 * Run with: npx tsx seed-test-deals.ts
 */

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { users, deals, commissionPayments, paymentSplits, quotes } from "./shared/schema";
import { eq, ilike, desc } from "drizzle-orm";
import 'dotenv/config';

const businessNames = [
    "Acme Coffee Shop",
    "Brighton Bakery",
    "Coastal Cafe",
    "Downtown Deli",
    "East End Electronics"
];

async function seedTestDeals() {
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

    console.log("=== SEEDING TEST DEALS ===\n");

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
    console.log();

    // 2. Create 5 test deals with commission data
    for (let i = 0; i < 5; i++) {
        const businessName = businessNames[i];
        const grossCommission = 1000 + (i * 500); // £1000, £1500, £2000, £2500, £3000

        console.log(`\n📝 Creating deal ${i + 1}: ${businessName} (£${grossCommission})...`);

        // Create the deal
        const [deal] = await db.insert(deals).values({
            businessName: businessName,
            contactName: `Test Contact ${i + 1}`,
            contactEmail: `test${i + 1}@example.com`,
            contactPhone: `0700000000${i}`,
            referrerId: lauren.id,
            parentReferrerId: admin.id,
            dealStage: 'completed',
            productType: 'card_payments',
            estimatedAnnualVolume: `£${grossCommission * 12}`,
            currentProcessor: 'WorldPay',
            submittedAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        console.log(`   ✅ Created deal: ${deal.id.slice(0, 8)}...`);

        // Create the commission payment with status 'needs_approval'
        const [payment] = await db.insert(commissionPayments).values({
            dealId: deal.id,
            recipientId: lauren.id,
            level: 0,
            amount: (grossCommission * 0.6).toFixed(2),
            percentage: '60.00',
            totalCommission: grossCommission.toString(),
            businessName: businessName,
            paymentStatus: 'needs_approval',
            approvalStatus: 'pending',
        }).returning();

        console.log(`   ✅ Created commission payment: ${payment.id.slice(0, 8)}...`);

        // Create payment splits for the hierarchy
        // Split 1: Lauren (Level 0 - 60%)
        await db.insert(paymentSplits).values({
            paymentId: payment.id,
            beneficiaryUserId: lauren.id,
            level: 0,
            percentage: '60.00',
            amount: (grossCommission * 0.6).toFixed(2),
            status: 'pending',
        });
        console.log(`   ✅ Created split for Lauren: £${(grossCommission * 0.6).toFixed(2)} (60%)`);

        // Split 2: Admin (Level 1 - 20%)
        await db.insert(paymentSplits).values({
            paymentId: payment.id,
            beneficiaryUserId: admin.id,
            level: 1,
            percentage: '20.00',
            amount: (grossCommission * 0.2).toFixed(2),
            status: 'pending',
        });
        console.log(`   ✅ Created split for Admin: £${(grossCommission * 0.2).toFixed(2)} (20%)`);

        // Note: No Level 2 since Admin has no parent
    }

    // 3. Verify what's in the table now
    console.log("\n\n📋 Verifying data...");

    const pendingPayments = await db
        .select()
        .from(commissionPayments)
        .where(eq(commissionPayments.paymentStatus, 'needs_approval'))
        .orderBy(desc(commissionPayments.createdAt));

    console.log(`\nTotal pending payments: ${pendingPayments.length}`);

    console.log("\n\n=== SEED COMPLETE ===");
    console.log("Refresh the Payment Portal to see 5 new deals in 'Pending Approval'!");
    console.log("Each deal shows the commission splits (Lauren 60%, Admin 20%)\n");

    await pool.end();
}

seedTestDeals().catch(console.error);
