const db = require('../../src/models');
const seedPermissions = require('../../src/database/seeders/permissionSeeder');
const seedAuthorization = require('../../src/database/seeders/authorizationSeeder');
const seedUsers = require('../../src/database/seeders/userSeeder');
const runSeeders = async () => {
    try {
        console.log("Running seeders...");

        // Ensure database connection is ready
        await db.sequelize.authenticate();

        // Run in sequence to respect dependencies
        await seedPermissions();
        await seedAuthorization();
        await seedUsers();
        // Add more seeders here as you build them (e.g., seedUsers)

        console.log("Database has seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

runSeeders();