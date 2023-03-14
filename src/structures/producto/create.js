const Joi = require('joi');

const validateSchema = require('../validateSchema');

module.exports = body => {

	const schema = Joi.object({
		name: Joi.string().required(),
		description: Joi.string().allow(''),
		imageUrl: Joi.string().required(),
		brandName: Joi.string().required(),
		style: Joi.string().required(),
		ibu: Joi.number().required(),
		abv: Joi.number().required(),
		price: Joi.number().required(),
		inStock: Joi.boolean().required(),
		isVisible: Joi.boolean(),
		launchDate: Joi.string().isoDate().allow('')
	});

	return validateSchema(schema, body);
};
