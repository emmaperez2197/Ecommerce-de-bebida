const nameModule = 'producto/';

const { app: create } = require('./src/create');
const { app: update } = require('./src/update');
const { app: list } = require('./src/list');
const { app: getById } = require('./src/get-by-id');

module.exports = define => {
	define(nameModule + 'create', create);
	define(nameModule + 'update', update);
	define(nameModule + 'list', list);
	define(nameModule + 'getbyid', getById);
};
