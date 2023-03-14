const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const { mockResponse, mockRequest } = require('../../mocks');

const { handler } = require('../../../src/routes/cart/src/addItem');
const CartModel = require('../../../src/models/Cart');
const ProductoModel = require('../../../src/models/Producto');

describe('Add items on cart api Test', () => {

	afterEach(() => sandbox.restore());

	const fakeIdCart = '6214f692bedfc49496526921';
	const fakeIdProduct = '6250716f135395088742ac53';

	const fakeData = {
		id: fakeIdProduct,
		quantity: 3
	};

	const fakeDataInvalidQuantity = { ...fakeData, quantity: 'string' };

	const fakeResponse = {
		idProduct: fakeIdProduct,
		idCart: fakeIdCart,
		quantity: 3
	};

	const fakeProducto = {
		_id: fakeIdProduct,
		name: 'Cerveza',
		description: '',
		imageUrl: 'Fake Url',
		brandName: 'Andes',
		attributes: { style: 'Amber Lager', ibu: 8, abv: 5 },
		price: 310,
		inStock: true,
		isVisible: true,
		launchDate: '2022-04-07T00:00:00.000Z',
		status: 'active'
	};

	const fakeCart = {
		_id: fakeIdCart,
		email: 'juani@example.com',
		items: [
		],
		status: 'active'
	};

	const fakeCartFormatted = {
		_id: fakeIdCart,
		email: 'juani@example.com',
		items: [
		],
		status: 'active'
	};

	const fakeCartWithProduct = {
		...fakeCart,
		items: [{
			id: '6250716f135395088742ac53',
			name: 'Cerveza',
			imageUrl: 'Fake Url',
			quantity: 3,
			price: 310
		}]
	};

	const fakeCartResError = {
		_id: '6214f692bedfc49496526921',
		email: 'juani@example.com',
		items: [
			{
				id: '6250716f135395088742ac53',
				name: 'Cerveza',
				imageUrl: 'Fake Url',
				quantity: 3,
				price: 310
			}
		],
		status: 'active'
	};

	const fakeResUpdate = { value: { _id: fakeIdCart } };

	const fakeIdNotExist = '6245d054b5c606ba867974ef';

	context('When no error occurs', () => {

		it('Should return 200 if add items on cart is successful', async () => {

			sandbox.stub(CartModel, 'findById').resolves(fakeCart);
			sandbox.stub(ProductoModel, 'findById').resolves(fakeProducto);
			sandbox.stub(CartModel, 'update').resolves(fakeResUpdate);

			const req = mockRequest(fakeData, { idCart: fakeIdCart });
			const res = mockResponse();

			await handler(req, res);

			assert.deepStrictEqual(res.status, 200);
			assert.deepStrictEqual(res.json, fakeResponse);

			sandbox.assert.calledOnceWithExactly(CartModel.findById, fakeIdCart);
			sandbox.assert.calledOnceWithExactly(ProductoModel.findById, fakeIdProduct);
			sandbox.assert.calledOnceWithExactly(CartModel.update, fakeIdCart, fakeCartWithProduct);
		});

		it('It should return 200 if the product exists in the cart and quantity is added', async () => {

			sandbox.stub(CartModel, 'findById').resolves(fakeCartWithProduct);
			sandbox.stub(ProductoModel, 'findById').resolves(fakeProducto);
			sandbox.stub(CartModel, 'update').resolves(fakeResUpdate);

			const req = mockRequest(fakeData, { idCart: fakeIdCart });
			const res = mockResponse();

			await handler(req, res);

			assert.deepStrictEqual(res.status, 200);
			assert.deepStrictEqual(res.json, { ...fakeResponse, quantity: 6 });

			sandbox.assert.calledOnceWithExactly(CartModel.findById, fakeIdCart);
			sandbox.assert.calledOnceWithExactly(ProductoModel.findById, fakeIdProduct);
			sandbox.assert.calledOnceWithExactly(CartModel.update, fakeIdCart, fakeCartWithProduct);
		});

	});

	context('When error is returned', () => {

		context('When id cart is invalid', () => {

			it('Should return 400 if id cart is invalid', async () => {

				sandbox.stub(CartModel, 'update');
				sandbox.stub(CartModel, 'findById');
				sandbox.stub(ProductoModel, 'findById');

				const req = mockRequest(fakeData, { idCart: 'Invalid id' });
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 400);
				assert.deepStrictEqual(res.json, { error: '"value" with value "Invalid id" fails to match the valid mongo id pattern' });
				sandbox.assert.notCalled(CartModel.update);
				sandbox.assert.notCalled(CartModel.findById);
				sandbox.assert.notCalled(ProductoModel.findById);
			});
		});

		context('When product by id does not exist', () => {

			it('Should return 400 if product by id does not exist', async () => {

				sandbox.stub(CartModel, 'update');
				sandbox.stub(CartModel, 'findById').resolves(null);
				sandbox.stub(ProductoModel, 'findById');

				const req = mockRequest(fakeData, { idCart: fakeIdNotExist });
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 404);
				assert.deepStrictEqual(res.json, { message: `No existe un producto con el id ${fakeData.id}` });
				sandbox.assert.notCalled(CartModel.update);
				sandbox.assert.notCalled(CartModel.findById);
				sandbox.assert.calledOnceWithExactly(ProductoModel.findById, fakeData.id);
			});
		});

		context('When id cart dont exist', () => {

			it('Should return 400 if id cart dont exist', async () => {

				sandbox.stub(CartModel, 'update');
				sandbox.stub(CartModel, 'findById').resolves(null);
				sandbox.stub(ProductoModel, 'findById').resolves(fakeProducto);

				const req = mockRequest(fakeData, { idCart: fakeIdNotExist });
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 404);
				assert.deepStrictEqual(res.json, { message: `No existe un carrito con el id ${fakeIdNotExist}` });
				sandbox.assert.notCalled(CartModel.update);
				sandbox.assert.calledOnceWithExactly(CartModel.findById, fakeIdNotExist);
				sandbox.assert.calledOnceWithExactly(ProductoModel.findById, fakeData.id);
			});
		});

		context('When quantity is invalid', () => {

			it('Should return 400 if quantity is invalid', async () => {

				sandbox.stub(CartModel, 'update');
				sandbox.stub(CartModel, 'findById');
				sandbox.stub(ProductoModel, 'findById');

				const req = mockRequest(fakeDataInvalidQuantity, { idCart: fakeIdNotExist });
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 400);
				assert.deepStrictEqual(res.json, { error: '"quantity" must be a number' });
				sandbox.assert.notCalled(CartModel.update);
				sandbox.assert.notCalled(CartModel.findById);
				sandbox.assert.notCalled(ProductoModel.findById);
			});
		});

		context('When occurs error in database', () => {

			it('Should return 500 if add items on cart fails', async () => {

				sandbox.stub(CartModel, 'update').rejects(new Error('Error in update'));
				sandbox.stub(CartModel, 'findById').resolves(fakeCartFormatted);
				sandbox.stub(ProductoModel, 'findById').resolves(fakeProducto);

				const req = mockRequest(fakeData, { idCart: fakeIdCart });
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 500);
				assert.deepStrictEqual(res.json, { message: 'Error: Error in update' });
				sandbox.assert.calledOnceWithExactly(CartModel.update, fakeIdCart, fakeCartResError);
				sandbox.assert.calledOnceWithExactly(CartModel.findById, fakeIdCart);
				sandbox.assert.calledOnceWithExactly(ProductoModel.findById, fakeData.id);
			});
		});

	});
});
