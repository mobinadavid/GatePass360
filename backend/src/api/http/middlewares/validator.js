const Joi = require('joi');
const ResponseBuilder = require('../response/ResponseBuilder');

const registerSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(8).required(),
    full_name: Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9]+$/).required()
});

const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = {};
        error.details.forEach(d => errors[d.path[0]] = d.message);
        return ResponseBuilder.api(req, res)
            .setStatusCode(422)
            .setErrors(errors)
            .send();
    }
    next();
};

module.exports = { validateRegister };