const assert = require('assert');
const CartModel = require('../../src/models/Cart');

const compareData = (model, data) => {
	assert.deepStrictEqual(model.email, data);
	assert.deepStrictEqual(model.items, []);
};

describe('Test Cart Model', () => {

	const data = 'fakeemail@example.com';
	it('Create Cart Model', async () => {

		const cartModel = new CartModel(data);
		compareData(cartModel, data);
	});

	it('Should return "carts" when execute the collection function', () => {

		const { collection } = CartModel;
		assert.deepStrictEqual(collection, 'carts');
	});

	it('Should return "carts" when execute the collection instantiated function', () => {

		const voiceModel = new CartModel(data);
		const { collection } = voiceModel;

		assert.deepStrictEqual(collection, 'carts');
	});

	it('Should return an instantiated object when execute the "instantiate" function', () => {
		const user = CartModel.instantiate(data);

		compareData(user, data);
	});
});
