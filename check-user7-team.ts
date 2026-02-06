import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function checkUser7Team() {
    console.log('Checking User7 team status...\n');

    // Get User7 details
    const user7Result = await db.execute(sql`
    SELECT id, email, first_name, last_name, partner_id, referral_code
    FROM users
    WHERE email = 'laurenfuller11@hotmail.com'
  `);

    if (user7Result.rows.length === 0) {
        console.log('❌ User7 not found!');
        process.exit(1);
    }

    const user7 = user7Result.rows[0];
    console.log('✅ User7 Found:');
    console.log(`   ID: ${user7.id}`);
    console.log(`   Email: ${user7.email}`);
    console.log(`   Partner ID: ${user7.partner_id}`);
    console.log(`   Referral Code: ${user7.referral_code}\n`);

    // Get team members
    const teamResult = await db.execute(sql`
    SELECT id, email, first_name, last_name, partner_id
    FROM users
    WHERE parent_partner_id = ${user7.id}
  `);

    console.log(`📋 Team Members: ${teamResult.rows.length}\n`);

    if (teamResult.rows.length === 0) {
        console.log('❌ No team members found for User7!');
        console.log('\nTIP: Make sure User10 has parent_partner_id set to User7\'s ID');
        process.exit(1);
    }

    // Check each team member's deals
    for (const member of teamResult.rows) {
        console.log(`\n👤 ${member.email} (${member.partner_id || 'No Partner ID'})`);

        const dealsResult = await db.execute(sql`
      SELECT 
        id,
        business_name,
        status,
        deal_stage,
        submitted_at,
        CASE 
          WHEN status IN ('approved', 'live', 'completed') 
            OR deal_stage IN ('approved', 'live_confirm_ltr', 'invoice_received', 'completed')
          THEN true
          ELSE false
        END as is_approved_stage,
        CASE
          WHEN (status IN ('approved', 'live', 'completed') 
            OR deal_stage IN ('approved', 'live_confirm_ltr', 'invoice_received', 'completed'))
            AND submitted_at >= NOW() - INTERVAL '6 months'
          THEN true
          ELSE false
        END as is_recent_approved
      FROM deals
      WHERE referrer_id = ${member.id}
      ORDER BY submitted_at DESC
    `);

        console.log(`   Total Deals: ${dealsResult.rows.length}`);

        if (dealsResult.rows.length > 0) {
            dealsResult.rows.forEach((deal, i) => {
                console.log(`\n   Deal ${i + 1}: ${deal.business_name}`);
                console.log(`     Status: "${deal.status}"`);
                console.log(`     Deal Stage: "${deal.deal_stage}"`);
                console.log(`     Submitted: ${deal.submitted_at}`);
                console.log(`     Is Approved Stage: ${deal.is_approved_stage ? '✅ YES' : '❌ NO'}`);
                console.log(`     Is Recent Approved: ${deal.is_recent_approved ? '✅ YES (Active!)' : '❌ NO'}`);
            });

            const approvedCount = dealsResult.rows.filter(d => d.is_approved_stage).length;
            const recentApprovedCount = dealsResult.rows.filter(d => d.is_recent_approved).length;

            console.log(`\n   📊 Summary:`);
            console.log(`     Approved Deals (all time): ${approvedCount}`);
            console.log(`     Recent Approved Deals (< 6 months): ${recentApprovedCount}`);
            console.log(`     Status: ${recentApprovedCount > 0 ? '✅ ACTIVE' : '❌ NOT ACTIVE'}`);
        } else {
            console.log(`   ⚠️  No deals found`);
        }
    }

    // Now check the API stats
    console.log('\n\n📊 Checking Team Stats from Storage Function...\n');

    const statsResult = await db.execute(sql`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN EXISTS (
        SELECT 1 FROM deals
        WHERE deals.referrer_id = users.id
          AND (
            deals.status IN ('approved', 'live', 'completed')
            OR deals.deal_stage IN ('approved', 'live_confirm_ltr', 'invoice_received', 'completed')
          )
          AND deals.submitted_at >= NOW() - INTERVAL '6 months'
      ) THEN 1 END) as active
    FROM users
    WHERE parent_partner_id = ${user7.id}
  `);

    const stats = statsResult.rows[0];
    console.log(`Total Team Members: ${stats.total}`);
    console.log(`Active Partners: ${stats.active}`);
    console.log(`Inactive Partners: ${stats.total - stats.active}`);
}

checkUser7Team()
    .then(() => {
        console.log('\n✅ Check complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
