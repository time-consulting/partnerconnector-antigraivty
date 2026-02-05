/**
 * List all referral codes in the system
 */

import { db } from './server/db';
import { users } from '@shared/schema';
import { sql } from 'drizzle-orm';

async function listReferralCodes() {
    console.log('📋 ALL REFERRAL CODES IN SYSTEM\n');
    console.log('='.repeat(60));

    const result = await db
        .select({
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            code: users.referralCode,
            partnerId: users.partnerId,
            hasParent: users.parentPartnerId,
        })
        .from(users)
        .where(sql`referral_code IS NOT NULL`)
        .orderBy(users.createdAt);

    console.log(`\nFound ${result.length} users with referral codes:\n`);

    result.forEach((user, i) => {
        const isRoot = !user.hasParent;
        console.log(`[${i + 1}] ${user.code} - ${user.email}`);
        console.log(`    Name: ${user.firstName} ${user.lastName}`);
        console.log(`    Partner ID: ${user.partnerId}`);
        console.log(`    Status: ${isRoot ? '👑 ROOT USER (no upline)' : '👤 Has referrer'}`);
        console.log('');
    });

    console.log('='.repeat(60));
    process.exit(0);
}

listReferralCodes();
