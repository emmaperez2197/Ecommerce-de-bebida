const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const { mockResponse, mockRequest } = require('../../mocks');

const { handler } = require('../../../src/routes/producto/src/create');
const ProductoModel = require('../../../src/models/Producto');

describe('Create producto api Test', () => {

	afterEach(() => sandbox.restore());

	const fakeData = {
		name: 'Fake Name',
		description: '',
		imageUrl: 'Fake Url',
		brandName: 'Fake Brandname',
		style: 'Fake style',
		ibu: 5,
		abv: 5,
		price: 5,
		inStock: true,
		isVisible: true,
		launchDate: ''
	};

	const {
		ibu, abv, price, inStock, isVisible, launchDate, ...fakeDataOnlyFieldsStrings
	} = fakeData;

	const fakeDataOnlyFieldsNumbers = ['ibu', 'abv', 'price'];

	const fakeDataOnlyFieldsBooleans = ['inStock', 'isVisible'];

	const fakeDataOnlyFieldDate = ['launchDate'];

	const fakeId = {
		acknowledged: true,
		insertedId: '6214f692bedfc49496526921'
	};

	context('When no error occurs', () => {

		it('Should return 200 if create product is successful', async () => {

			sandbox.stub(ProductoModel.prototype, 'insert').resolves(fakeId);

			const req = mockRequest(fakeData);
			const res = mockResponse();

			await handler(req, res);

			assert.deepStrictEqual(res.status, 200);
			sandbox.assert.calledOnceWithExactly(ProductoModel.prototype.insert);
		});

	});

	context('When error is returned', () => {

		context('When String is invalid', () => {

			Object.keys(fakeDataOnlyFieldsStrings).forEach(field => {

				it(`Should return 400 if ${field} is invalid`, async () => {

					sandbox.stub(ProductoModel.prototype, 'insert');

					const req = mockRequest({ ...fakeData, [field]: 5 });
					const res = mockResponse();

					await handler(req, res);

					assert.deepStrictEqual(res.status, 400);
					assert.deepStrictEqual(res.json, { error: `"${field}" must be a string` });
					sandbox.assert.notCalled(ProductoModel.prototype.insert);
				});
			});
		});

		context('When Number is invalid', () => {

			fakeDataOnlyFieldsNumbers.forEach(field => {

				it(`Should return 400 if ${field} is invalid`, async () => {

					sandbox.stub(ProductoModel.prototype, 'insert');

					const req = mockRequest({ ...fakeData, [field]: 'String' });
					const res = mockResponse();

					await handler(req, res);

					assert.deepStrictEqual(res.status, 400);
					assert.deepStrictEqual(res.json, { error: `"${field}" must be a number` });
					sandbox.assert.notCalled(ProductoModel.prototype.insert);
				});
			});
		});

		context('When Boolean is invalid', () => {

			fakeDataOnlyFieldsBooleans.forEach(field => {

				it(`Should return 400 if ${field} is invalid`, async () => {

					sandbox.stub(ProductoModel.prototype, 'insert');

					const req = mockRequest({ ...fakeData, [field]: 'String' });
					const res = mockResponse();

					await handler(req, res);

					assert.deepStrictEqual(res.status, 400);
					assert.deepStrictEqual(res.json, { error: `"${field}" must be a boolean` });
					sandbox.assert.notCalled(ProductoModel.prototype.insert);
				});
			});
		});

		context('When Date is invalid', () => {

			fakeDataOnlyFieldDate.forEach(field => {

				it(`Should return 400 if ${field} is invalid`, async () => {

					sandbox.stub(ProductoModel.prototype, 'insert');

					const req = mockRequest({ ...fakeData, [field]: 'String' });
					const res = mockResponse();

					await handler(req, res);

					assert.deepStrictEqual(res.status, 400);
					assert.deepStrictEqual(res.json, { error: `"${field}" must be in iso format` });
					sandbox.assert.notCalled(ProductoModel.prototype.insert);
				});
			});
		});

		context('When occurs error in database', () => {

			it('Should return 500 if the insert fails', async () => {

				sandbox.stub(ProductoModel.prototype, 'insert').rejects(new Error('Error in insert'));

				const req = mockRequest(fakeData);
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 500);
				assert.deepStrictEqual(res.json, { message: 'Error: Error in insert' });
				sandbox.assert.calledOnceWithExactly(ProductoModel.prototype.insert);
			});
		});
	});
});
