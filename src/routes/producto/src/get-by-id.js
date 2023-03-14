const express = require('express');

const ProductoModel = require('../../../models/Producto');
const schemaID = require('../../../structures/validate-object-id');

const app = express.Router();

const handler = async (req, res) => {

	const validation = await schemaID(req.params.id);
	if(validation.error)
		return res.status(400).json(validation);

	try {
		const productbyid = await ProductoModel.findById(req.params.id);
		if(!productbyid)
			return res.status(404).json({ message: 'Error, el id no existe' });

		res.status(200).json(productbyid);

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}

};

app.get('/:id', handler);

module.exports = { app, handler };
