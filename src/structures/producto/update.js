const Joi = require('joi');

const validateSchema = require('../validateSchema');

module.exports = body => {

	const schema = Joi.object({
		_id: Joi.objectId().optional(),
		name: Joi.string().optional(),
		description: Joi.string().optional(),
		imageUrl: Joi.string().optional(),
		brandName: Joi.string().optional(),
		style: Joi.string().optional(),
		ibu: Joi.number().optional(),
		abv: Joi.number().optional(),
		price: Joi.number().optional(),
		inStock: Joi.boolean().optional(),
		isVisible: Joi.boolean().optional(),
		launchDate: Joi.string().isoDate().optional()
	});

	return validateSchema(schema, body);
};
