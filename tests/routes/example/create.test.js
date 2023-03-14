const sandbox = require('sinon').createSandbox();
const assert = require('assert');
const { mockResponse, mockRequest } = require('../../mocks');

const { handler } = require('../../../src/routes/example/src/create');
const ExampleModel = require('../../../src/models/Example');

describe('Create example api Test', () => {

	afterEach(() => sandbox.restore());

	const fakeData = { name: 'marcos', age: 22 };

	const fakeDataInvalidName = { ...fakeData, name: 5 };
	const fakeDataInvalidAge = { ...fakeData, age: 'string' };
	const fakeId = {
		acknowledged: true,
		insertedId: '6214f692bedfc49496526921'
	};

	const responseError = { error: '"name" must be a string' };
	const responseError1 = { error: '"age" must be a number' };

	context('When no error occurs', () => {

		it('Should return 200 if create example is successful', async () => {

			sandbox.stub(ExampleModel.prototype, 'insert').resolves(fakeId);

			const req = mockRequest(fakeData);
			const res = mockResponse();

			await handler(req, res);

			assert.deepStrictEqual(res.status, 200);
			sandbox.assert.calledOnceWithExactly(ExampleModel.prototype.insert);
		});

	});

	context('When error is returned', () => {

		context('When name is invalid', () => {

			it('Should return 400 if name is invalid', async () => {

				sandbox.stub(ExampleModel.prototype, 'insert');

				const req = mockRequest(fakeDataInvalidName);
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 400);
				assert.deepStrictEqual(res.json, responseError);
				sandbox.assert.notCalled(ExampleModel.prototype.insert);
			});
		});

		context('When age is invalid', () => {

			it('Should return 400 if age is invalid', async () => {

				sandbox.stub(ExampleModel.prototype, 'insert');

				const req = mockRequest(fakeDataInvalidAge);
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 400);
				assert.deepStrictEqual(res.json, responseError1);
				sandbox.assert.notCalled(ExampleModel.prototype.insert);
			});
		});

		context('When occurs error in database', () => {

			it('Should return 500 if the insert fails', async () => {

				sandbox.stub(ExampleModel.prototype, 'insert').rejects(new Error('Error in insert'));

				const req = mockRequest(fakeData);
				const res = mockResponse();

				await handler(req, res);

				assert.deepStrictEqual(res.status, 500);
				assert.deepStrictEqual(res.json, { message: 'Error: Error in insert' });
				sandbox.assert.calledOnceWithExactly(ExampleModel.prototype.insert);
			});
		});

	});
});
