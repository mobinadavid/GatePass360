const fs = require('fs');
const path = require('path');
const db = require('../../src/database/database');

async function runMigration() {
    const action = process.argv[2]; // 'up' or 'down'
    const migrationsDir = path.join(__dirname, '../../src/database/migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    console.log(`Running migrations: ${action}...`);

    for (const file of files) {
        const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        // Split SQL file by comments -- UP and -- DOWN
        const [upSql, downSql] = content.split('-- DOWN');

        try {
            if (action === 'up') {
                await db.query(upSql.replace('-- UP', ''));
                console.log(`Successfully migrated UP: ${file}`);
            } else if (action === 'down') {
                await db.query(downSql);
                console.log(`Successfully migrated DOWN: ${file}`);
            }
        } catch (err) {
            console.error(`Error in ${file}:`, err.message);
            process.exit(1);
        }
    }
    await db.close();
}

runMigration();