const Joi = require('joi');

const validateSchema = require('../validateSchema');

module.exports = body => {

	const schema = Joi.object({
		name: Joi.string().required(),
		age: Joi.number().optional()
	});

	return validateSchema(schema, body);
};
