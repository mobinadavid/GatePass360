const { Op } = require('sequelize');

const visitFilter = (req, res, next) => {
    const { host_id, status, date } = req.query;
    const filter = {};

    if (host_id) filter.host_id = host_id;
    if (status) filter.status = status;
    if (date) filter.visit_date = date;

    req.visitFilter = filter;
    next();
};

module.exports = visitFilter;