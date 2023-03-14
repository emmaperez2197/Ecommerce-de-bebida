const express = require('express');

const ProductoModel = require('../../../models/Producto');
const schemaList = require('../../../structures/producto/list');

const app = express.Router();

const handler = async (req, res) => {

	const validation = await schemaList(req.query);
	if(validation.error)
		return res.status(400).json(validation);

	const filters = {

		...req.query.brandName && { brandName: req.query.brandName },
		...req.query.inStock && { inStock: JSON.parse(req.query.inStock.toLowerCase()) },
		...req.query.isVisible && { isVisible: JSON.parse(req.query.isVisible.toLowerCase()) }
	};

	const sort = {
		lessExpensive: { price: 1 },
		moreExpensive: { price: -1 },
		lessBitter: { ibu: 1 },
		moreBiter: { ibu: -1 }
	};

	const order = sort[req.query.orderBy] ? sort[req.query.orderBy] : {};

	try {
		const productList = await ProductoModel.get(filters, order);
		res.status(200).json({ productList });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}

};

app.get('/', handler);

module.exports = { app, handler };
