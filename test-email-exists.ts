import { db } from './server/db.js';
import { users } from './shared/schema.js';
import { eq } from 'drizzle-orm';

const testEmail = 'Referraltest.user21@gmail.com';

async function checkEmail() {
    console.log(`\n🔍 Checking if "${testEmail}" exists in database...\n`);

    try {
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, testEmail))
            .limit(1);

        if (existingUser) {
            console.log('✅ EMAIL EXISTS IN DATABASE!');
            console.log('User Details:');
            console.log(`  ID: ${existingUser.id}`);
            console.log(`  Email: ${existingUser.email}`);
            console.log(`  Created: ${existingUser.createdAt}`);
            console.log(`  Parent Partner ID: ${existingUser.parentPartnerId || 'NULL'}`);
            console.log('\n💡 This explains the "Email already registered" error.');
        } else {
            console.log('❌ EMAIL DOES NOT EXIST');
            console.log('\n⚠️  The error is NOT due to a duplicate email in the database.');
            console.log('There may be a different issue with the signup flow.');
        }
    } catch (error) {
        console.error('Database error:', error);
    }

    process.exit(0);
}

checkEmail();
