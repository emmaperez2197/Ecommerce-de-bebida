'use strict';

const keepFields = require('../formatters/keep-fields');
const removeFields = require('../formatters/remove-fields');

module.exports = ({ fieldsToKeep, fieldsToRemove } = {}) => {

	if(fieldsToKeep)
		return keepFields(fieldsToKeep);

	if(fieldsToRemove)
		return removeFields(fieldsToRemove);

	return items => items;
};
