const express = require('express');

const app = express.Router();

const CartModel = require('../../../models/Cart');
const schemaCreate = require('../../../structures/cart/create');

const handler = async (req, res) => {

	const validation = await schemaCreate(req.body);

	if(validation.error)
		return res.status(400).json(validation);

	const { email } = req.body;

	const getCartByEmail = await CartModel.getOne({ email });

	if(getCartByEmail)
		return res.status(200).json({ message: `Ya existe un carrito con el email ${email}` });

	const cart = new CartModel(req.body.email);

	try {

		const cartInserted = await cart.insert();

		res.status(200).json({ cartInserted: cartInserted.insertedId });
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}

};

app.post('/', handler);

module.exports = { app, handler };
