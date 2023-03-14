const express = require('express');
const areObjectsEquals = require('are-objects-equals');

const app = express.Router();

const ProductoModel = require('../../../models/Producto');
const schemaCreate = require('../../../structures/producto/update');
const schemaID = require('../../../structures/validate-object-id');

const handler = async (req, res) => {
	const { id } = req.params;
	const validation = await schemaCreate(req.body);
	const validationId = await schemaID(req.params.id);
	const { body } = req;
	const { style, ibu, abv, ...bodyWithOutAttributes } = body;
	const bodyFormatted = { ...bodyWithOutAttributes, attributes: { style, ibu, abv } };
	if(validation.error)
		return res.status(400).json(validation);
	if(validationId.error)
		return res.status(400).json(validationId);
	try {

		const getProductById = await ProductoModel.findById(id);

		if(!getProductById)
			return res.status(400).json({ message: `No existe un producto con el id ${id}` });

		const { _id, status, ...getProductByIdFormatted } = getProductById;
		if(areObjectsEquals(getProductByIdFormatted, bodyFormatted))
			return res.status(400).json({ message: 'No hay cambios en el producto' });

		const productoUpdated = await ProductoModel.update(id, bodyFormatted);
		res.status(200).json({ productoUpdated: productoUpdated.value._id });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}

};

app.put('/:id', handler);

module.exports = { app, handler };
