const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const { mockResponse, mockRequest } = require('../../mocks');

const { handler } = require('../../../src/routes/producto/src/get-by-id');
const ProductoModel = require('../../../src/models/Producto');

describe('Find by Id producto api Test', () => {

	afterEach(() => sandbox.restore());

	const fakeId = '6245d054b5c606ba867974ee';
	const fakeIdNotExist = '6245d054b5c606ba867974ef';

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

	context('When no error occurs', () => {

		it('Should return 200 if find by id and return product is successful', async () => {
			sandbox.stub(ProductoModel, 'findById').resolves(fakeProducto);

			const req = mockRequest({}, { id: fakeId });
			const res = mockResponse();

			await handler(req, res);

			assert.deepStrictEqual(res.status, 200);
			sandbox.assert.calledOnceWithExactly(ProductoModel.findById, fakeId);
		});

	});

	context('When error occurs', () => {

		context('When ProductById does not exist', () => {

			it('Should return 404 if ProductById does not exist', async () => {
				sandbox.stub(ProductoModel, 'findById').resolves(null);

				const req = mockRequest({}, { id: fakeIdNotExist });
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 404);
				assert.deepStrictEqual(res.json, { message: 'Error, el id no existe' });
				sandbox.assert.calledOnceWithExactly(ProductoModel.findById, fakeIdNotExist);

			});
		});

		context('When Id formatted is invalid', () => {

			it('Should return 400 if Id product is not valid', async () => {

				sandbox.stub(ProductoModel, 'findById');

				const req = mockRequest({}, { id: 'Invalid id' });
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 400);
				assert.deepStrictEqual(res.json, { error: '"value" with value "Invalid id" fails to match the valid mongo id pattern' });
				sandbox.assert.notCalled(ProductoModel.findById);

			});
		});

		context('When occurs error in database', () => {

			it('Should return 500 if the findById fails', async () => {

				sandbox.stub(ProductoModel, 'findById').rejects(new Error('Error in findById'));

				const req = mockRequest({}, { id: fakeId });
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 500);
				assert.deepStrictEqual(res.json, { message: 'Error: Error in findById' });
				sandbox.assert.calledOnceWithExactly(ProductoModel.findById, fakeId);
			});
		});
	});
});
