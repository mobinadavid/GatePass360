const Joi = require('joi');
const ResponseBuilder = require('../../response/ResponseBuilder');

const visitSchema = Joi.object({
    host_id: Joi.number().integer().required(),
    purpose: Joi.string().min(5).max(255).required(),
    visit_date: Joi.date().iso().required() // Format: YYYY-MM-DD
});

const validateVisit = (req, res, next) => {
    const { error } = visitSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = {};
        error.details.forEach(d => errors[d.path[0]] = d.message);
        return ResponseBuilder.api(req, res).setStatusCode(422).setErrors(errors).send();
    }
    next();
};

module.exports = { validateVisit };