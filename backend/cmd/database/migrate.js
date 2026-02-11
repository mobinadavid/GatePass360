const fs = require('fs');
const path = require('path');
const db = require('../../src/database/database');

async function runMigration() {
    const action = process.argv[2]; // 'up' or 'down'
    if (action !== 'up' && action !== 'down') {
        console.error("Usage: npm run migrate:up OR npm run migrate:down");
        process.exit(1);
    }

    const migrationsDir = path.join(__dirname, '../../src/database/migrations');

    // 1. Filter files based on the action (.up.sql or .down.sql)
    let files = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith(`.${action}.sql`));

    // 2. Sort UP (001 -> 002) and DOWN (002 -> 001)
    // Important: Down must be reverse order to handle Foreign Keys!
    files.sort((a, b) => action === 'up' ? a.localeCompare(b) : b.localeCompare(a));

    console.log(`🚀 Running migrations: ${action.toUpperCase()}...`);

    for (const file of files) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8').trim();

        if (!sql) {
            console.warn(`⚠️ Skipping empty file: ${file}`);
            continue;
        }

        try {
            await db.query(sql);
            console.log(`✅ Successfully migrated: ${file}`);
        } catch (err) {
            console.error(`❌ Error in ${file}:`, err.message);
            process.exit(1);
        }
    }

    // In many Node PG setups, db.close() or pool.end() is needed to exit the process
    if (db.pool) await db.pool.end();
    console.log("🏁 Migration process finished.");
    process.exit(0);
}

runMigration();