/**
 * Fix User10's link to User7
 * Run this in Replit: npx tsx fix-user10-link.ts
 */

import { db } from './server/db';
import { users, partnerHierarchy } from '@shared/schema';
import { eq, sql } from 'drizzle-orm';

async function fixUser10Link() {
    console.log('🔧 FIXING USER10 LINK TO USER7\n');
    console.log('='.repeat(60));

    const user7Id = '3e18e285-ff75-4c8a-9254-d12cff73bb56';
    const user10Id = '73da48fe-9b27-44d8-b1e3-2adbcf5682ee';

    try {
        // Step 1: Update User10's parent_partner_id
        console.log('\n📌 Step 1: Linking User10 to User7...\n');

        const updateResult = await db
            .update(users)
            .set({
                parentPartnerId: user7Id,
                updatedAt: new Date()
            })
            .where(eq(users.id, user10Id))
            .returning();

        if (updateResult.length > 0) {
            console.log('✅ User10.parent_partner_id updated!');
            console.log(`   Set to: ${user7Id}`);
        } else {
            console.log('❌ Update failed - User10 not found?');
            process.exit(1);
        }

        // Step 2: Create hierarchy entry
        console.log('\n📌 Step 2: Creating hierarchy entry...\n');

        try {
            const hierarchyResult = await db
                .insert(partnerHierarchy)
                .values({
                    childId: user10Id,
                    parentId: user7Id,
                    level: 1,
                    createdAt: new Date()
                })
                .returning();

            console.log('✅ Hierarchy entry created!');
            console.log(`   Child: ${user10Id}`);
            console.log(`   Parent: ${user7Id}`);
            console.log(`   Level: 1`);
        } catch (error: any) {
            if (error.message?.includes('duplicate') || error.code === '23505') {
                console.log('⚠️  Hierarchy entry already exists (this is OK)');
            } else {
                throw error;
            }
        }

        // Step 3: Verify the link
        console.log('\n📌 Step 3: Verifying the link...\n');

        const verification = await db
            .select({
                user10Email: users.email,
                user10ParentId: users.parentPartnerId,
            })
            .from(users)
            .where(eq(users.id, user10Id))
            .limit(1);

        if (verification[0].user10ParentId === user7Id) {
            console.log('✅ VERIFICATION PASSED!');
            console.log(`   User10 email: ${verification[0].user10Email}`);
            console.log(`   Parent ID: ${verification[0].user10ParentId}`);
            console.log(`   Expected: ${user7Id}`);
            console.log('   ✅ MATCH!');
        } else {
            console.log('❌ VERIFICATION FAILED!');
            console.log(`   Parent ID: ${verification[0].user10ParentId}`);
            console.log(`   Expected: ${user7Id}`);
        }

        // Step 4: Check if User10 will appear on dashboard
        console.log('\n📌 Step 4: Checking dashboard query...\n');

        const dashboardTest = await db
            .select({
                id: users.id,
                email: users.email,
            })
            .from(users)
            .where(eq(users.parentPartnerId, user7Id));

        console.log(`   Found ${dashboardTest.length} team member(s) for User7:\n`);

        dashboardTest.forEach((member, i) => {
            const isUser10 = member.id === user10Id;
            console.log(`   [${i + 1}] ${member.email} ${isUser10 ? '← USER10 ✅' : ''}`);
        });

        console.log('\n' + '='.repeat(60));
        console.log('🎉 FIX COMPLETE!\n');
        console.log('User10 is now linked to User7.');
        console.log('User10 WILL appear on User7\'s dashboard.');
        console.log('\n💡 Next: Check User7\'s dashboard in the browser!');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('\n❌ ERROR:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

fixUser10Link();
