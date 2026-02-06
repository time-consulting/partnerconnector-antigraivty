/**
 * Diagnostic script to check User25's upline chain
 * Investigating why User7 appears twice
 */

import { db } from './server/db.js';
import { users, partnerHierarchy } from './shared/schema.js';
import { eq } from 'drizzle-orm';

async function diagnoseUser25Upline() {
    console.log('\n🔍 DIAGNOSING USER25 UPLINE CHAIN\n');
    console.log('='.repeat(60));

    // Find User25 (most recent signup - dashboard.test or similar)
    const allUsers = await db.select().from(users).orderBy(users.createdAt);

    // Try to find by email pattern
    const user25Candidates = allUsers.filter((u: any) =>
        u.email?.includes('dashboard') ||
        u.email?.includes('test') ||
        u.email?.includes('user25')
    ).slice(-5); // Last 5 test users

    console.log(`\n📋 Recent test users (last 5):\n`);
    user25Candidates.forEach((u: any, i) => {
        console.log(`[${i + 1}] ${u.email}`);
        console.log(`    ID: ${u.id}`);
        console.log(`    Name: ${u.firstName} ${u.lastName}`);
        console.log(`    Partner ID: ${u.partnerId}`);
        console.log(`    Parent: ${u.parentPartnerId || 'NULL'}\n`);
    });

    // Let's check the most recent one
    const user25 = user25Candidates[user25Candidates.length - 1];

    if (!user25) {
        console.log('❌ No test user found. Please specify email.');
        process.exit(1);
    }

    console.log(`\n🎯 Analyzing: ${user25.email}\n`);
    console.log('='.repeat(60));

    // Walk up the parent chain
    console.log('\n📊 UPLINE CHAIN (Walking parent_partner_id):\n');

    let currentParentId = user25.parentPartnerId;
    let level = 1;
    const seenIds = new Set();

    while (currentParentId && level <= 10) {
        // Check for circular reference
        if (seenIds.has(currentParentId)) {
            console.log(`\n⚠️  CIRCULAR REFERENCE DETECTED!`);
            console.log(`   Already saw parent ID: ${currentParentId}`);
            break;
        }
        seenIds.add(currentParentId);

        const [parent] = await db
            .select()
            .from(users)
            .where(eq(users.id, currentParentId))
            .limit(1);

        if (!parent) {
            console.log(`   Level ${level}: ❌ Parent ID ${currentParentId} NOT FOUND in database`);
            break;
        }

        console.log(`   Level ${level}:`);
        console.log(`      ID: ${parent.id}`);
        console.log(`      Name: ${parent.firstName} ${parent.lastName}`);
        console.log(`      Email: ${parent.email}`);
        console.log(`      Partner Code: ${parent.partnerId || 'NULL'}`);
        console.log(`      Has Parent: ${parent.parentPartnerId ? 'Yes (' + parent.parentPartnerId + ')' : 'No (root)'}\n`);

        currentParentId = parent.parentPartnerId;
        level++;
    }

    if (level === 1) {
        console.log('   (No upline - direct signup)\n');
    }

    // Check partner_hierarchy table
    console.log('='.repeat(60));
    console.log('\n📊 PARTNER_HIERARCHY TABLE:\n');

    const hierarchyEntries = await db
        .select()
        .from(partnerHierarchy)
        .where(eq(partnerHierarchy.childId, user25.id));

    if (hierarchyEntries.length === 0) {
        console.log('   ⚠️  No entries found in partner_hierarchy for this user\n');
    } else {
        console.log(`   Found ${hierarchyEntries.length} entries:\n`);
        for (const entry of hierarchyEntries) {
            const [parent] = await db.select().from(users).where(eq(users.id, entry.parentId)).limit(1);
            console.log(`   Level ${entry.level}: ${parent?.firstName} ${parent?.lastName} (${parent?.partnerId})`);
            console.log(`      Parent ID: ${entry.parentId}`);
            console.log(`      Created: ${entry.createdAt}\n`);
        }
    }

    console.log('='.repeat(60));
    console.log('\n✅ DIAGNOSIS COMPLETE\n');

    process.exit(0);
}

diagnoseUser25Upline();
