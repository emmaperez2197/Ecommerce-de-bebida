const express = require('express');

const app = express.Router();

const CartModel = require('../../../models/Cart');
const ProductoModel = require('../../../models/Producto');
const schemaId = require('../../../structures/validate-object-id');
const schemaItem = require('../../../structures/cart/addItem');

const handler = async (req, res) => {

	const { idCart } = req.params;
	const { id, quantity } = req.body;

	const validation = await schemaId(idCart);
	if(validation.error)
		return res.status(400).json(validation);

	const validationBody = await schemaItem(req.body);
	if(validationBody.error)
		return res.status(400).json(validationBody);

	try {

		const getProductById = await ProductoModel.findById(id);
		if(!getProductById)
			return res.status(404).json({ message: `No existe un producto con el id ${id}` });
		const getCartById = await CartModel.findById(idCart);
		if(!getCartById)
			return res.status(404).json({ message: `No existe un carrito con el id ${idCart}` });
		const product = !getCartById.items.length ? null : getCartById.items.find(currentProduct => currentProduct.id === id);
		let productFormatted;
		if(product)
			product.quantity += quantity;
		else {
			const { name, imageUrl, price } = getProductById;
			productFormatted = {
				id, name, imageUrl, quantity, price
			};
			getCartById.items.push(productFormatted);
		}

		const cartUpdated = await CartModel.update(idCart, getCartById);

		res.status(200).json({ idProduct: id, idCart: cartUpdated.value._id, quantity: product ? product.quantity : productFormatted.quantity });
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}

};

app.post('/:idCart', handler);

module.exports = { app, handler };
