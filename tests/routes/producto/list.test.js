const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const { mockResponse, mockRequest } = require('../../mocks');

const { handler } = require('../../../src/routes/producto/src/list');
const ProductoModel = require('../../../src/models/Producto');

describe('List, filter and order producto api Test', () => {

	afterEach(() => sandbox.restore());

	const query = {
		brandName: 'Corona',
		inStock: 'true',
		isVisible: 'true',
		orderBy: 'moreExpensive'
	};

	const fakeFilters = {
		brandName: 'Corona',
		inStock: true,
		isVisible: true
	};

	const sort = {
		lessExpensive: { price: 1 },
		moreExpensive: { price: -1 },
		lessBitter: { ibu: 1 },
		moreBiter: { ibu: -1 }
	};

	const fakeDataOnlyFieldsStrings = ['brandName'];
	const fakeDataOnlyFieldsBooleans = ['inStock', 'isVisible'];

	const fakeData = [
		{
			_id: '62507a0c135395088742ac57',
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
		},
		{
			_id: '62507a38135395088742ac59',
			name: 'Cerveza',
			description: '',
			imageUrl: 'Fake Url',
			brandName: 'Andes',
			attributes: { style: 'IPA', ibu: 8, abv: 6 },
			price: 320,
			inStock: true,
			isVisible: true,
			launchDate: '2022-04-07T00:00:00.000Z',
			status: 'active'
		},
		{
			_id: '62507a26135395088742ac58',
			name: 'Cerveza',
			description: '',
			imageUrl: 'Fake Url',
			brandName: 'Andes',
			attributes: { style: 'American Pilsner', ibu: 6, abv: 4 },
			price: 330,
			inStock: true,
			isVisible: true,
			launchDate: '2022-04-07T00:00:00.000Z',
			status: 'active'
		}
	];

	context('When no error occurs', () => {

		it('Should return 200 if get product is successful', async () => {

			sandbox.stub(ProductoModel, 'get').resolves(fakeData);

			const req = mockRequest({}, {}, query);
			const res = mockResponse();

			await handler(req, res);

			assert.deepStrictEqual(res.status, 200);
			sandbox.assert.calledOnceWithExactly(ProductoModel.get, fakeFilters, sort[query.orderBy]);
		});

	});

	context('When error occurs', () => {

		context('When String is invalid', () => {

			fakeDataOnlyFieldsStrings.forEach(field => {

				it(`Should return 400 if ${field} is invalid`, async () => {

					sandbox.stub(ProductoModel, 'get');

					const req = mockRequest({}, {}, { ...query, [field]: 5 });
					const res = mockResponse();

					await handler(req, res);

					assert.deepStrictEqual(res.status, 400);
					assert.deepStrictEqual(res.json, { error: `"${field}" must be a string` });
					sandbox.assert.notCalled(ProductoModel.get);
				});
			});
		});

		context('When Boolean is invalid', () => {

			fakeDataOnlyFieldsBooleans.forEach(field => {

				it(`Should return 400 if ${field} is invalid`, async () => {

					sandbox.stub(ProductoModel, 'get');

					const req = mockRequest({}, {}, { ...query, [field]: 'String' });
					const res = mockResponse();

					await handler(req, res);

					assert.deepStrictEqual(res.status, 400);
					assert.deepStrictEqual(res.json, { error: `"${field}" must be a boolean` });
					sandbox.assert.notCalled(ProductoModel.get);
				});
			});
		});

		context('When occurs error in database', () => {

			it('Should return 500 if the get fails', async () => {

				sandbox.stub(ProductoModel, 'get').rejects(new Error('Error in get'));

				const req = mockRequest();
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 500);
				assert.deepStrictEqual(res.json, { message: 'Error: Error in get' });
				sandbox.assert.calledOnceWithExactly(ProductoModel.get, {}, {});
			});
		});
	});
});
