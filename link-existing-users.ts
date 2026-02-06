/**
 * Link existing users to a referrer for testing
 * Run: npx tsx link-existing-users.ts
 */

import { db } from './server/db';
import { users, partnerHierarchy } from '@shared/schema';
import { eq, isNull, or, sql } from 'drizzle-orm';

async function linkExistingUsers() {
    console.log('🔗 LINK EXISTING USERS TO REFERRER\n');
    console.log('='.repeat(60));

    // Step 1: Find User7 (or specify your referrer)
    const referrerEmail = 'lauren.fuller11@hotmail.com'; // Change if needed

    console.log(`\n📌 Finding referrer: ${referrerEmail}...\n`);

    const [referrer] = await db
        .select({
            id: users.id,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            referralCode: users.referralCode,
        })
        .from(users)
        .where(eq(users.email, referrerEmail))
        .limit(1);

    if (!referrer) {
        console.log(`❌ Referrer not found: ${referrerEmail}`);
        console.log('   Update the referrerEmail variable in this script.');
        process.exit(1);
    }

    console.log('✅ Referrer found:');
    console.log(`   Name: ${referrer.firstName} ${referrer.lastName}`);
    console.log(`   Email: ${referrer.email}`);
    console.log(`   Code: ${referrer.referralCode}`);
    console.log(`   ID: ${referrer.id}`);

    // Step 2: Find all users WITHOUT a parent (orphaned users)
    console.log('\n📌 Finding users without a referrer...\n');

    const orphanedUsers = await db
        .select({
            id: users.id,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            createdAt: users.createdAt,
        })
        .from(users)
        .where(
            sql`${users.parentPartnerId} IS NULL AND ${users.id} != ${referrer.id}`
        )
        .orderBy(users.createdAt);

    if (orphanedUsers.length === 0) {
        console.log('✅ No orphaned users found - all users already have referrers!');
        process.exit(0);
    }

    console.log(`Found ${orphanedUsers.length} user(s) without a referrer:\n`);

    orphanedUsers.forEach((user, i) => {
        console.log(`[${i + 1}] ${user.email}`);
        console.log(`    Name: ${user.firstName} ${user.lastName}`);
        console.log(`    Joined: ${user.createdAt}`);
        console.log('');
    });

    // Step 3: Link them all to the referrer
    console.log('\n📌 Linking users to referrer...\n');

    let linkedCount = 0;
    let errorCount = 0;

    for (const user of orphanedUsers) {
        try {
            // Update parent_partner_id
            await db
                .update(users)
                .set({
                    parentPartnerId: referrer.id,
                    updatedAt: new Date(),
                })
                .where(eq(users.id, user.id));

            // Create hierarchy entry
            try {
                await db
                    .insert(partnerHierarchy)
                    .values({
                        childId: user.id,
                        parentId: referrer.id,
                        level: 1,
                        createdAt: new Date(),
                    });
            } catch (hierarchyError: any) {
                // Ignore duplicate errors
                if (!hierarchyError.message?.includes('duplicate')) {
                    throw hierarchyError;
                }
            }

            console.log(`✅ Linked: ${user.email}`);
            linkedCount++;
        } catch (error: any) {
            console.log(`❌ Error linking ${user.email}: ${error.message}`);
            errorCount++;
        }
    }

    // Step 4: Verify
    console.log('\n📌 Verification...\n');

    const teamMembers = await db
        .select({
            email: users.email,
            firstName: users.firstName,
        })
        .from(users)
        .where(eq(users.parentPartnerId, referrer.id));

    console.log('='.repeat(60));
    console.log('📋 SUMMARY\n');
    console.log(`Referrer: ${referrer.email}`);
    console.log(`Users linked: ${linkedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`\nTotal team members: ${teamMembers.length}\n`);

    if (teamMembers.length > 0) {
        console.log('Team Members:');
        teamMembers.forEach((member, i) => {
            console.log(`  ${i + 1}. ${member.email} (${member.firstName})`);
        });
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 DONE!\n');
    console.log(`${referrer.firstName}'s team now has ${teamMembers.length} member(s).`);
    console.log('\n💡 Next: Check the Team Management dashboard in the browser!');
    console.log('='.repeat(60));

    process.exit(0);
}

linkExistingUsers().catch(error => {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
});
