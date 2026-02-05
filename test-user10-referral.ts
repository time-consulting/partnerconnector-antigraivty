/**
 * Test if User10 (darren.business123@gmail.com) was linked to User7 (uu001)
 */

import { db } from './server/db';
import { users, partnerHierarchy } from '@shared/schema';
import { eq, ilike, or } from 'drizzle-orm';

async function testReferral() {
    console.log('🔍 TESTING REFERRAL: User10 → User7 (uu001)\n');
    console.log('='.repeat(60));

    // Find User7 (referrer with code uu001)
    console.log('\n📌 STEP 1: Finding User7 (referrer with code uu001)...\n');

    const [user7] = await db
        .select({
            id: users.id,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            referralCode: users.referralCode,
        })
        .from(users)
        .where(eq(users.referralCode, 'uu001'))
        .limit(1);

    if (!user7) {
        console.log('❌ User7 not found!');
        process.exit(1);
    }

    console.log('✅ User7 (referrer) found:');
    console.log(`   Email: ${user7.email}`);
    console.log(`   Name: ${user7.firstName} ${user7.lastName}`);
    console.log(`   Code: ${user7.referralCode}`);
    console.log(`   ID: ${user7.id}`);

    // Find User10 (new signup)
    console.log('\n📌 STEP 2: Finding User10 (darren.business123@gmail.com)...\n');

    const [user10] = await db
        .select({
            id: users.id,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            parentPartnerId: users.parentPartnerId,
            referralCode: users.referralCode,
            createdAt: users.createdAt,
        })
        .from(users)
        .where(
            or(
                ilike(users.email, '%darren.business123%'),
                ilike(users.firstName, '%user10%'),
                ilike(users.email, '%business123%')
            )
        )
        .orderBy(users.createdAt)
        .limit(1);

    if (!user10) {
        console.log('❌ User10 not found!');
        console.log('   Did they complete signup?');

        console.log('\n🔍 Let me show recent signups:\n');
        const recent = await db
            .select({
                email: users.email,
                firstName: users.firstName,
                createdAt: users.createdAt,
            })
            .from(users)
            .orderBy(users.createdAt)
            .limit(5);

        console.table(recent);
        process.exit(1);
    }

    console.log('✅ User10 found:');
    console.log(`   Email: ${user10.email}`);
    console.log(`   Name: ${user10.firstName} ${user10.lastName}`);
    console.log(`   ID: ${user10.id}`);
    console.log(`   Created: ${user10.createdAt}`);
    console.log(`   parent_partner_id: ${user10.parentPartnerId || 'NULL'}`);

    // Check if linked
    console.log('\n📌 STEP 3: Checking if User10 is linked to User7...\n');

    if (!user10.parentPartnerId) {
        console.log('❌ FAIL: User10.parent_partner_id is NULL!');
        console.log('   User10 is NOT linked to any referrer.');
        console.log('\n🔍 DIAGNOSIS:');
        console.log('   1. Check server logs for errors during signup');
        console.log('   2. Referral code lookup may have failed');
        console.log('   3. setupReferralHierarchy() may have thrown error');
        console.log('\n💡 MANUAL FIX:');
        console.log(`   UPDATE users SET parent_partner_id = '${user7.id}' WHERE id = '${user10.id}';`);
        process.exit(1);
    }

    if (user10.parentPartnerId === user7.id) {
        console.log('✅ SUCCESS! User10 IS linked to User7!');
        console.log(`   User10.parent_partner_id = ${user10.parentPartnerId}`);
        console.log(`   User7.id = ${user7.id}`);
        console.log('   ✅ PERFECT MATCH!');
    } else {
        console.log('⚠️  User10 is linked to a DIFFERENT user!');
        console.log(`   User10.parent_partner_id = ${user10.parentPartnerId}`);
        console.log(`   Expected User7.id = ${user7.id}`);
        console.log('   ❌ MISMATCH!');

        // Find who they're linked to
        const [actualParent] = await db
            .select({
                email: users.email,
                referralCode: users.referralCode,
            })
            .from(users)
            .where(eq(users.id, user10.parentPartnerId))
            .limit(1);

        if (actualParent) {
            console.log(`\n   Actually linked to: ${actualParent.email}`);
            console.log(`   Their code: ${actualParent.referralCode}`);
        }
        process.exit(1);
    }

    // Check partner_hierarchy
    console.log('\n📌 STEP 4: Checking partner_hierarchy table...\n');

    const hierarchyEntries = await db
        .select()
        .from(partnerHierarchy)
        .where(eq(partnerHierarchy.childId, user10.id));

    if (hierarchyEntries.length === 0) {
        console.log('⚠️  No entries in partner_hierarchy for User10');
        console.log('   This should be created during signup.');
    } else {
        console.log(`✅ Found ${hierarchyEntries.length} hierarchy entry/entries:`);
        hierarchyEntries.forEach(entry => {
            console.log(`   Level ${entry.level}: parent = ${entry.parentId}`);
        });
    }

    // Simulate dashboard query
    console.log('\n📌 STEP 5: Will User10 show on User7\'s dashboard?\n');

    const teamMembers = await db
        .select({
            id: users.id,
            email: users.email,
            firstName: users.firstName,
        })
        .from(users)
        .where(eq(users.parentPartnerId, user7.id));

    console.log(`   Dashboard query found ${teamMembers.length} team member(s):\n`);

    if (teamMembers.length === 0) {
        console.log('   ❌ No team members found for User7!');
    } else {
        teamMembers.forEach((member, i) => {
            const isUser10 = member.id === user10.id;
            console.log(`   [${i + 1}] ${member.email} ${isUser10 ? '← USER10 ✅' : ''}`);
        });
    }

    const user10InDashboard = teamMembers.find(m => m.id === user10.id);

    console.log('\n' + '='.repeat(60));
    console.log('📋 FINAL RESULT\n');

    if (user10InDashboard) {
        console.log('🎉 SUCCESS! ✅');
        console.log('\nReferral system is working correctly:');
        console.log(`✅ User10 signed up with ref=uu001`);
        console.log(`✅ User10 was linked to User7`);
        console.log(`✅ User10 WILL appear on User7's dashboard`);
        console.log(`✅ ${hierarchyEntries.length > 0 ? 'Hierarchy created' : 'Hierarchy needs creation'}`);
    } else {
        console.log('❌ FAILED!');
        console.log('\nUser10 will NOT show on User7\'s dashboard.');
        console.log('Check the issues above.');
    }

    console.log('='.repeat(60));
    process.exit(0);
}

testReferral();
