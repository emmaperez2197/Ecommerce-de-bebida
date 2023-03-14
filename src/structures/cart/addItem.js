const Joi = require('joi');

const validateSchema = require('../validateSchema');

module.exports = body => {

	const schema = Joi.object({
		id: Joi.objectId().required(),
		quantity: Joi.number().integer().required()
	});

	return validateSchema(schema, body);
};
