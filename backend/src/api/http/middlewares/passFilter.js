const { Op } = require('sequelize');

const passFilter = (req, res, next) => {
    const { pass_code, is_present, date } = req.query;
    const filter = {};

    if (pass_code) filter.pass_code = pass_code;

    if (is_present === 'true') {
        filter.check_in_time = { [Op.ne]: null };
        filter.check_out_time = null;
    }

    if (date) {
        filter.created_at = {
            [Op.gte]: new Date(date + 'T00:00:00'),
            [Op.lte]: new Date(date + 'T23:59:59')
        };
    }

    req.passFilter = filter;
    next();
};

module.exports = passFilter;