const express = require('express');

const app = express.Router();

const ProductoModel = require('../../../models/Producto');
const schemaCreate = require('../../../structures/producto/create');

const handler = async (req, res) => {

	const validation = await schemaCreate(req.body);

	if(validation.error)
		return res.status(400).json(validation);

	const producto = new ProductoModel(req.body);

	try {
		const productoInserted = await producto.insert();

		res.status(200).json({ productoInserted: productoInserted.insertedId });
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}

};

app.post('/', handler);

module.exports = { app, handler };
