const { MongoClient } = require('mongodb');

class Mongo {

	constructor() {
		this.url = process.env.URL_DB;
		this.dbName = process.env.NAME_DATABASE;
	}

	async connect() {
		try {
			const client = await MongoClient.connect(this.url);
			const db = await client.db(this.dbName);

			return db;
		} catch(error) {
			return error.toString();
		}
	}
}

module.exports = Mongo;
