const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const { mockResponse, mockRequest } = require('../../mocks');

const { handler } = require('../../../src/routes/producto/src/update');
const ProductoModel = require('../../../src/models/Producto');

describe('Update producto api Test', () => {

	afterEach(() => sandbox.restore());

	const fakeData = {
		name: 'Fake Name',
		description: 'Fake Description',
		imageUrl: 'Fake Url',
		brandName: 'Fake Brandname',
		style: 'Fake style',
		ibu: 5,
		abv: 5,
		price: 5,
		inStock: true,
		isVisible: true,
		launchDate: '2022-04-07'
	};

	const fakeProductoEqualFakeData = {
		_id: '6245d054b5c606ba867974ee',
		name: 'Fake Name',
		description: 'Fake Description',
		imageUrl: 'Fake Url',
		brandName: 'Fake Brandname',
		attributes: { style: 'Fake style', ibu: 5, abv: 5 },
		price: 5,
		inStock: true,
		isVisible: true,
		launchDate: '2022-04-07',
		status: 'active'
	};
	const fakeId = '6245d054b5c606ba867974ee';

	const bodyFormatted = {
		name: 'Fake Name',
		description: 'Fake Description',
		imageUrl: 'Fake Url',
		brandName: 'Fake Brandname',
		price: 5,
		inStock: true,
		isVisible: true,
		launchDate: '2022-04-07',
		attributes: { style: 'Fake style', ibu: 5, abv: 5 }
	};

	const fakeUpdate = {
		value: {
			_id: fakeId,
			name: 'Cristian',
			description: 'Fake Description',
			imageUrl: 'Fake Url',
			brandName: 'Fake Brandname',
			attributes: { style: null, ibu: null, abv: null },
			price: 5,
			inStock: true,
			isVisible: true,
			launchDate: '2022-03-30',
			status: 'active'
		}
	};

	const fakeProducto = {
		_id: '6245d054b5c606ba867974ee',
		name: 'Cristian',
		description: 'Fake Description',
		imageUrl: 'Fake Url',
		brandName: 'Fake Brandname',
		attributes: { style: 'Fake style', ibu: 5, abv: 5 },
		price: 5,
		inStock: true,
		isVisible: true,
		launchDate: '2022-04-07',
		status: 'active'
	};

	const {
		ibu, abv, price, inStock, isVisible, launchDate, ...fakeDataOnlyFieldsStrings
	} = fakeData;

	const fakeDataOnlyFieldsNumbers = ['ibu', 'abv', 'price'];

	const fakeDataOnlyFieldsBooleans = ['inStock', 'isVisible'];

	const fakeDataOnlyFieldDate = ['launchDate'];

	const fakeIdNotExist = '6245d054b5c606ba867974ef';

	context('When no error occurs', () => {

		it('Should return 200 if update product is successful', async () => {

			sandbox.stub(ProductoModel, 'update').resolves(fakeUpdate);
			sandbox.stub(ProductoModel, 'findById').resolves(fakeProducto);

			const req = mockRequest(fakeData, { id: fakeId });
			const res = mockResponse();

			await handler(req, res);

			assert.deepStrictEqual(res.status, 200);
			sandbox.assert.calledOnceWithExactly(ProductoModel.update, fakeId, bodyFormatted);
		});

	});

	context('When error occurs', () => {

		context('When String is invalid', () => {

			Object.keys(fakeDataOnlyFieldsStrings).forEach(field => {

				it(`Should return 400 if ${field} is invalid`, async () => {

					sandbox.stub(ProductoModel, 'update').resolves(fakeUpdate);
					sandbox.stub(ProductoModel, 'findById').resolves(fakeProducto);

					const req = mockRequest({ ...fakeData, [field]: 5 });
					const res = mockResponse();

					await handler(req, res);

					assert.deepStrictEqual(res.status, 400);
					assert.deepStrictEqual(res.json, { error: `"${field}" must be a string` });
					sandbox.assert.notCalled(ProductoModel.update);
				});
			});
		});

		context('When Number is invalid', () => {

			fakeDataOnlyFieldsNumbers.forEach(field => {

				it(`Should return 400 if ${field} is invalid`, async () => {

					sandbox.stub(ProductoModel, 'update').resolves(fakeUpdate);
					sandbox.stub(ProductoModel, 'findById').resolves(fakeProducto);

					const req = mockRequest({ ...fakeData, [field]: 'string' });
					const res = mockResponse();

					await handler(req, res);

					assert.deepStrictEqual(res.status, 400);
					assert.deepStrictEqual(res.json, { error: `"${field}" must be a number` });
					sandbox.assert.notCalled(ProductoModel.update);
				});
			});
		});

		context('When Boolean is invalid', () => {

			fakeDataOnlyFieldsBooleans.forEach(field => {

				it(`Should return 400 if ${field} is invalid`, async () => {

					sandbox.stub(ProductoModel, 'update').resolves(fakeUpdate);
					sandbox.stub(ProductoModel, 'findById').resolves(fakeProducto);

					const req = mockRequest({ ...fakeData, [field]: 'String' });
					const res = mockResponse();

					await handler(req, res);

					assert.deepStrictEqual(res.status, 400);
					assert.deepStrictEqual(res.json, { error: `"${field}" must be a boolean` });
					sandbox.assert.notCalled(ProductoModel.update);
				});
			});
		});

		context('When Date is invalid', () => {

			fakeDataOnlyFieldDate.forEach(field => {

				it(`Should return 400 if ${field} is invalid`, async () => {

					sandbox.stub(ProductoModel, 'update').resolves(fakeUpdate);
					sandbox.stub(ProductoModel, 'findById').resolves(fakeProducto);

					const req = mockRequest({ ...fakeData, [field]: 'String' });
					const res = mockResponse();

					await handler(req, res);

					assert.deepStrictEqual(res.status, 400);
					assert.deepStrictEqual(res.json, { error: `"${field}" must be in iso format` });
					sandbox.assert.notCalled(ProductoModel.update);
				});
			});
		});

		context('When Id formatted is invalid', () => {

			it('Should return 400 if Id product is not valid', async () => {

				sandbox.stub(ProductoModel, 'update');
				sandbox.stub(ProductoModel, 'findById');

				const req = mockRequest(fakeData, { id: 'Invalid id' });
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 400);
				assert.deepStrictEqual(res.json, { error: '"value" with value "Invalid id" fails to match the valid mongo id pattern' });
				sandbox.assert.notCalled(ProductoModel.update);
				sandbox.assert.notCalled(ProductoModel.findById);

			});
		});

		context('When ProductById does not exist', () => {

			it('Should return 400 if ProductById does not exist', async () => {

				sandbox.stub(ProductoModel, 'update');
				sandbox.stub(ProductoModel, 'findById').resolves(null);

				const req = mockRequest(fakeData, { id: fakeIdNotExist });
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 400);
				assert.deepStrictEqual(res.json, { message: `No existe un producto con el id ${fakeIdNotExist}` });
				sandbox.assert.notCalled(ProductoModel.update);
				sandbox.assert.calledOnceWithExactly(ProductoModel.findById, fakeIdNotExist);

			});
		});

		context('when there are no changes', () => {

			it('Should return 400 if no changes', async () => {

				sandbox.stub(ProductoModel, 'update');
				sandbox.stub(ProductoModel, 'findById').resolves(fakeProductoEqualFakeData);

				const req = mockRequest(fakeData, { id: fakeId });
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 400);
				assert.deepStrictEqual(res.json, { message: 'No hay cambios en el producto' });
				sandbox.assert.notCalled(ProductoModel.update);
				sandbox.assert.calledOnceWithExactly(ProductoModel.findById, fakeId);

			});
		});

		context('When occurs error in database', () => {

			it('Should return 500 if the update fails', async () => {

				sandbox.stub(ProductoModel, 'update').rejects(new Error('Error in update'));
				sandbox.stub(ProductoModel, 'findById').resolves(fakeProducto);

				const req = mockRequest(fakeData, { id: fakeId });
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 500);
				assert.deepStrictEqual(res.json, { message: 'Error: Error in update' });
				sandbox.assert.calledOnceWithExactly(ProductoModel.update, fakeId, bodyFormatted);
				sandbox.assert.calledOnceWithExactly(ProductoModel.findById, fakeId);
			});
			it('Should return 500 if the findById fails', async () => {

				sandbox.stub(ProductoModel, 'update');
				sandbox.stub(ProductoModel, 'findById').rejects(new Error('Error in findById'));

				const req = mockRequest(fakeData, { id: fakeId });
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 500);
				assert.deepStrictEqual(res.json, { message: 'Error: Error in findById' });
				sandbox.assert.notCalled(ProductoModel.update);
				sandbox.assert.calledOnceWithExactly(ProductoModel.findById, fakeId);
			});
		});
	});
});
