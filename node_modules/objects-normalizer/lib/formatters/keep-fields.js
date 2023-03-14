'use strict';

module.exports = fields => item => fields.reduce((itemFormatted, field) => ({
	...itemFormatted,
	...item[field] !== undefined ? { [field]: item[field] } : {}
}), {});
