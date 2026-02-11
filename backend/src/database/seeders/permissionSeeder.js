const { Permission } = require('../../models');

const permissions = [
    { slug: 'visits.create', title_fa: 'ثبت درخواست ورود' },
    { slug: 'visits.view_own', title_fa: 'مشاهده وضعیت درخواست‌های خود' },
    { slug: 'visits.view_host', title_fa: 'مشاهده درخواست‌های مربوط به خود' },
    { slug: 'visits.approve', title_fa: 'تأیید درخواست مهمان' },
    { slug: 'visits.approve', title_fa: 'رد درخواست مهمان' },
    { slug: 'passes.issue', title_fa: 'صدور مجوز ورود' },
    { slug: 'passes.record_traffic', title_fa: 'ثبت ورود و خروج مهمان' },
    { slug: 'admin.manage', title_fa: 'مدیریت کاربران و نقش‌ها' }
];

const seedPermissions = async () => {
    for (const p of permissions) {
        await Permission.findOrCreate({
            where: { slug: p.slug },
            defaults: p
        });
    }
    console.log("✅ Permission Seeder executed successfully.");
};

module.exports = seedPermissions;