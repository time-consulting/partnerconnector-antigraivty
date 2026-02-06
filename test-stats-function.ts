import { DatabaseStorage } from './server/storage';

const storage = new DatabaseStorage();

async function testGetTeamReferralStats() {
    const user7Id = '859a2a8b-c06c-444b-a83b-6db878ae5d22';

    console.log('Testing getTeamReferralStats for User7...\n');

    const stats = await storage.getTeamReferralStats(user7Id);

    console.log('Result from getTeamReferralStats:');
    console.log(JSON.stringify(stats, null, 2));

    console.log('\n\nExpected:');
    console.log('  active: 1');
    console.log('  inactive: 0');
    console.log('  teamMembers: 1');
}

testGetTeamReferralStats()
    .then(() => {
        console.log('\n✅ Test complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
