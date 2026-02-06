import { db } from './server/db.js';
import { users } from './shared/schema.js';

async function main() {
    try {
        const allUsers = await db.select().from(users);
        console.log('Database Connection Successful.');
        console.log('Existing Users:');
        allUsers.forEach(u => {
            console.log(`- ID: ${u.id}, Email: ${u.email}`);
        });
    } catch (error) {
        console.error('Error connecting to database:', error);
    } finally {
        process.exit(0);
    }
}

main();
