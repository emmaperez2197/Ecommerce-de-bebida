const Joi = require('joi');

const validateSchema = require('../validateSchema');

module.exports = body => {

	const schema = Joi.object({
		email: Joi.string().email().required()
	});

	return validateSchema(schema, body);
};
