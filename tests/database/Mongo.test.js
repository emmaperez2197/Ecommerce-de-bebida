const sandbox = require('sinon').createSandbox();

const { MongoClient } = require('mongodb');
const Mongo = require('../../modules/database/Mongo');

const mongo = new Mongo();

const client = {
	fakeData: 'Juan carlos',
	db: () => 'fakedb'
};

const fakeDb = {
	fakeData: 'fakedb'
};

describe('Mongo Test', () => {

	afterEach(() => sandbox.restore());

	context('When connect correctly', () => {

		it('Should return connection to Mongo', async () => {

			sandbox.stub(MongoClient, 'connect').resolves(client);
			sandbox.stub(MongoClient.prototype, 'db').resolves(fakeDb);

			await mongo.connect();

			sandbox.assert.calledOnce(MongoClient.connect);
		});
	});

	context('When an error occurs', () => {

		it('Should return an error if fail to get client', async () => {

			sandbox.stub(MongoClient, 'connect').rejects(new Error('Fail to get client'));
			sandbox.stub(MongoClient.prototype, 'db').resolves(fakeDb);

			await mongo.connect();

			sandbox.assert.calledOnce(MongoClient.connect);
			sandbox.assert.notCalled(MongoClient.prototype.db);
		});

	});
});
