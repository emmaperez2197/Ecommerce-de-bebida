const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validateSchema = require('./validateSchema');

module.exports = id => {

	const schema = Joi.objectId().required();

	return validateSchema(schema, id);
};
