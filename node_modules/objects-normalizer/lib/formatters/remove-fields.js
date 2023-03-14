'use strict';

module.exports = fields => item => fields.reduce((itemFormatted, field) => {

	delete itemFormatted[field];
	return itemFormatted;

}, { ...item });
