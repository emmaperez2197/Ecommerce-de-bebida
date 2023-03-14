const Joi = require('joi');

const validateSchema = require('../validateSchema');

module.exports = query => {

	const schema = Joi.object({
		brandName: Joi.string().optional(),
		inStock: Joi.boolean().optional(),
		isVisible: Joi.boolean().optional(),
		orderBy: Joi.string().valid('lessExpensive', 'moreExpensive', 'lessBitter', 'moreBitter')
	});

	return validateSchema(schema, query);
};
