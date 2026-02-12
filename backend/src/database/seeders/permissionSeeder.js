const { Permission } = require('../../models');

const permissions = [
    { slug: 'visits.create', title_fa: 'ثبت درخواست ورود' },
    { slug: 'visits.view_own', title_fa: 'مشاهده وضعیت درخواست‌های خود' },
    { slug: 'visits.view_host', title_fa: 'مشاهده درخواست‌های مربوط به خود' },
    { slug: 'visits.view_all', title_fa: 'مشاهده تمام درخواست‌ها' },
    { slug: 'visits.view_stats', title_fa: 'مشاهده گزارش آماری' },
    { slug: 'visits.view_details', title_fa: 'مشاهده جزییات درخواست ها' },
    { slug: 'visits.approve', title_fa: 'تأیید درخواست مهمان' },
    { slug: 'visits.approve', title_fa: 'رد درخواست مهمان' },
    { slug: 'passes.issue', title_fa: 'صدور مجوز ورود' },
    { slug: 'passes.record_traffic', title_fa: 'ثبت ورود و خروج مهمان' },
    { slug: 'passes.passes.view_all', title_fa: 'مشاهده ورود و خروجی ها' },
    { slug: 'admin.manage', title_fa: 'مدیریت کاربران و نقش‌ها' },
    {slug: 'visits.view_approved',title_fa:'مشاهده درخواست‌های تأییدشده توسط میزبان'},
    {slug: 'passes.view_reports',title_fa:'نمایش لیست افراد حاضر در مجموعه'},
    {slug: 'reports.view',title_fa:'نمایش گزارش آماری'},
    {slug: 'users.list',title_fa:'نمایش کاربران'},
    {slug: 'users.update_role',title_fa:'دادن نقش به کاربران'},
    {slug: 'user-reports.view',title_fa:'نمایش گزارش کاربران'},
    {slug: 'roles.list',title_fa:'مشاهده نقش‌ ها'},

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