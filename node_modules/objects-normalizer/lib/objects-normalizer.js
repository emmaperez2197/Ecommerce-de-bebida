'use strict';

const F = require('press-f');

const isObject = require('./validate/is-object');
const validateOptions = require('./validate/validate-options');
const getFormatter = require('./validate/get-formatter');

module.exports = (items, options) => {

	if(!items)
		return [];

	if(!isObject(items) || (Array.isArray(items) && items.some(item => !isObject(item) || Array.isArray(item))))
		throw new F('Invalid Items must be an Object or Array of Objects', 'ObjectNormalizerError');

	validateOptions(options);

	const validItems = !Array.isArray(items) ? [items] : items;
	const formatter = getFormatter(options);

	const formattedItems = validItems.map(formatter);

	return !Array.isArray(items) ? formattedItems[0] : formattedItems;
};
