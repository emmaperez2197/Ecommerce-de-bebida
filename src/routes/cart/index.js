const nameModule = 'cart/';

const { app: create } = require('./src/create');
const { app: addItem } = require('./src/addItem');
const { app: getById } = require('./src/get-by-id');

module.exports = define => {
	define(nameModule + 'create', create);
	define(nameModule + 'addItem', addItem);
	define(nameModule + 'getbyid', getById);
};
