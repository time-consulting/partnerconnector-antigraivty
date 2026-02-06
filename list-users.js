import { db } from './server/db.js';
import { sql } from 'drizzle-orm';

async function listUsers() {
    try {
        const result = await db.execute(sql`SELECT email FROM users`);
        console.log('Current users in database:');
        result.rows.forEach(row => console.log(`- ${row.email}`));
    } catch (error) {
        console.error('Error listing users:', error);
    } finally {
        process.exit();
    }
}

listUsers();
