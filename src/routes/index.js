let app = null;
const example = require('./example');
const producto = require('./producto');
const cart = require('./cart');

const defineRoute = (ruta, requests) => {
	const baseRequest = '/api/';
	const route = baseRequest + ruta;

	app.use(route, requests);
};

module.exports = aplication => {
	app = aplication;

	example(defineRoute);
	producto(defineRoute);
	cart(defineRoute);
};
