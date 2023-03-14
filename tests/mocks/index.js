const http = require('http');

const res = Object.create(http.ServerResponse.prototype);

const mockResponse = () => {

	// if(!res.status) {
	// 	this.status = 200;
	// 	return this;
	// }

	res.status = function status(code) {
		this.status = code;
		return this;
	};

	res.json = function json(object) {
		this.json = object;
		return this;
	};

	return res;
};

const mockRequest = (body = {}, params = {}, query = {}) => ({ body, params, query });

module.exports = { mockResponse, mockRequest };
