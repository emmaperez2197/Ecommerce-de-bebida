'use strict';

const F = require('press-f');

const isObject = require('./is-object');

const validFields = ['fieldsToKeep', 'fieldsToRemove'];

module.exports = options => {

	if(!options)
		return;

	if(!isObject(options) || Array.isArray(options))
		throw new F('Invalid Options must be an Object', 'ObjectNormalizerError');

	validFields.forEach(validField => {
		if(options[validField] && (!Array.isArray(options[validField]) || !options[validField].every(field => typeof field === 'string')))
			throw new F(`Invalid Options, ${validField} must be Array`, 'ObjectNormalizerError');
	});
};
