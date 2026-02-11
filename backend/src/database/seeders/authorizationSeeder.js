const { Role, Permission } = require('../../models');

const rolesData = [
    { name: 'guest', perms: ['visits.create', 'visits.view_own'] },
    { name: 'host', perms: ['visits.view_host', 'visits.approve'] },
    { name: 'security', perms: ['passes.issue', 'passes.record_traffic'] },
    { name: 'admin', perms: null } // Assign all permissions
];

const seedAuthorization = async () => {
    const allPermissions = await Permission.findAll(); // Fetch all seeded permissions

    for (const r of rolesData) {
        const [role] = await Role.findOrCreate({ where: { name: r.name } });

        let targetPerms;
        if (r.perms === null) {
            targetPerms = allPermissions;
        } else {
            targetPerms = allPermissions.filter(p => r.perms.includes(p.slug));
        }

        // Association Setter
        await role.setPermissions(targetPerms);
    }
    console.log("✅ Authorization Seeder executed successfully.");
};

module.exports = seedAuthorization;