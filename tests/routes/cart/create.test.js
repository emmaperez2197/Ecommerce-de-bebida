const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const { mockResponse, mockRequest } = require('../../mocks');

const { handler } = require('../../../src/routes/cart/src/create');
const CartModel = require('../../../src/models/Cart');

describe('Create Cart api Test', () => {

	afterEach(() => sandbox.restore());

	const fakeData = { email: 'fakeemail@example.com' };
	const fakeEmailExists = { email: 'fakeemail@example.com' };

	const fakeDataInvalidEmail = { ...fakeData, email: 'email-erroneo' };
	const fakeId = {
		acknowledged: true,
		insertedId: '6214f692bedfc49496526921'
	};

	const responseError = { error: '"email" must be a valid email' };

	context('When no error occurs', () => {

		it('Should return 200 if create cart is successful', async () => {

			sandbox.stub(CartModel.prototype, 'insert').resolves(fakeId);
			sandbox.stub(CartModel, 'getOne').resolves(null);

			const req = mockRequest(fakeData);
			const res = mockResponse();

			await handler(req, res);

			assert.deepStrictEqual(res.status, 200);
			sandbox.assert.calledOnceWithExactly(CartModel.prototype.insert);
			sandbox.assert.calledOnceWithExactly(CartModel.getOne, { email: fakeData.email });
		});

		it('Should return 200 if email in cart exist', async () => {

			sandbox.stub(CartModel.prototype, 'insert');
			sandbox.stub(CartModel, 'getOne').resolves(fakeData);

			const req = mockRequest(fakeEmailExists);
			const res = mockResponse();

			await handler(req, res);

			assert.deepStrictEqual(res.status, 200);
			assert.deepStrictEqual(res.json, { message: `Ya existe un carrito con el email ${fakeEmailExists.email}` });
			sandbox.assert.notCalled(CartModel.prototype.insert);
			sandbox.assert.calledOnceWithExactly(CartModel.getOne, fakeEmailExists);
		});

	});

	context('When error is returned', () => {

		context('When email is invalid', () => {

			it('Should return 400 if email is invalid', async () => {

				sandbox.stub(CartModel.prototype, 'insert');
				sandbox.stub(CartModel, 'getOne');

				const req = mockRequest(fakeDataInvalidEmail);
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 400);
				assert.deepStrictEqual(res.json, responseError);
				sandbox.assert.notCalled(CartModel.prototype.insert);
				sandbox.assert.notCalled(CartModel.getOne);
			});
		});

		context('When occurs error in database', () => {

			it('Should return 500 if the insert fails', async () => {

				sandbox.stub(CartModel.prototype, 'insert').rejects(new Error('Error in insert'));
				sandbox.stub(CartModel, 'getOne').resolves(null);

				const req = mockRequest(fakeData);
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 500);
				assert.deepStrictEqual(res.json, { message: 'Error: Error in insert' });
				sandbox.assert.calledOnceWithExactly(CartModel.prototype.insert);
				sandbox.assert.calledOnceWithExactly(CartModel.getOne, { email: fakeData.email });
			});
		});

	});
});
