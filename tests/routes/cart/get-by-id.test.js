const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const { mockResponse, mockRequest } = require('../../mocks');

const { handler } = require('../../../src/routes/cart/src/get-by-id');
const CartModel = require('../../../src/models/Cart');

describe('Find by Id producto api Test', () => {

	afterEach(() => sandbox.restore());

	const fakeId = '6245d054b5c606ba867974ee';
	const fakeIdNotExist = '6245d054b5c606ba867974ef';

	const fakeProducto = {
		_id: '625717695adf3f95ef7ac7e0',
		email: 'juani@example.com',
		items: [
			{
				id: '6250716f135395088742ac53',
				name: 'Cerveza',
				imageUrl: 'Fake Url',
				quantity: 11,
				price: 300
			},
			{
				id: '62507a26135395088742ac58',
				name: 'Cerveza',
				imageUrl: 'Fake Url',
				quantity: 2,
				price: 330
			},
			{
				id: '62507a0c135395088742ac57',
				name: 'Cerveza',
				imageUrl: 'Fake Url',
				quantity: 2,
				price: 310
			}
		],
		status: 'active'
	};

	context('When no error occurs', () => {

		it('Should return 200 if find by id and return product is successful', async () => {
			sandbox.stub(CartModel, 'findById').resolves(fakeProducto);

			const req = mockRequest({}, { id: fakeId });
			const res = mockResponse();

			await handler(req, res);

			assert.deepStrictEqual(res.status, 200);
			sandbox.assert.calledOnceWithExactly(CartModel.findById, fakeId);
		});

	});

	context('When error occurs', () => {

		context('When CartById does not exist', () => {

			it('Should return 404 if CartById does not exist', async () => {
				sandbox.stub(CartModel, 'findById').resolves(null);

				const req = mockRequest({}, { id: fakeIdNotExist });
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 404);
				assert.deepStrictEqual(res.json, { message: 'Error, el id no existe' });
				sandbox.assert.calledOnceWithExactly(CartModel.findById, fakeIdNotExist);

			});
		});

		context('When Id formatted is invalid', () => {

			it('Should return 400 if id cart is not valid', async () => {

				sandbox.stub(CartModel, 'findById');

				const req = mockRequest({}, { id: 'Invalid id' });
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 400);
				assert.deepStrictEqual(res.json, { error: '"value" with value "Invalid id" fails to match the valid mongo id pattern' });
				sandbox.assert.notCalled(CartModel.findById);

			});
		});

		context('When occurs error in database', () => {

			it('Should return 500 if the findById fails', async () => {

				sandbox.stub(CartModel, 'findById').rejects(new Error('Error in findById'));

				const req = mockRequest({}, { id: fakeId });
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 500);
				assert.deepStrictEqual(res.json, { message: 'Error: Error in findById' });
				sandbox.assert.calledOnceWithExactly(CartModel.findById, fakeId);
			});
		});
	});
});
