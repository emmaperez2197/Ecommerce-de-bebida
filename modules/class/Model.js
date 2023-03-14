const { ObjectId } = require('mongodb');
const Mongo = require('../database/Mongo');

const mongo = new Mongo();

module.exports = class Model {

	static get collection() {
		return 'default';
	}

	get collection() {
		return 'default';
	}

	static get statuses() {
		return {
			active: 'active',
			inactive: 'inactive'
		};
	}

	async insert() {

		const db = await mongo.connect();

		try {
			return db.collection(this.collection).insertOne(this);
		} catch(error) {
			return error.message;
		}
	}

	static async update(id, obj) {

		const db = await mongo.connect();
		try {
			return db.collection(this.collection).findOneAndUpdate({ _id: ObjectId(id) }, { $set: obj });
		} catch(error) {
			return error.message;
		}
	}

	static async findById(id) {
		const db = await mongo.connect();
		try {
			return db.collection(this.collection).findOne({ _id: ObjectId(id) });
		} catch(error) {
			return error.message;
		}
	}

	static async get(filters = {}, orderBy = {}) {
		try {
			const db = await mongo.connect();

			return	db.collection(this.collection).find(filters).sort(orderBy).toArray();
		} catch(error) {
			return error.message;
		}
	}

	static async getOne(params = {}) {
		try {
			const db = await mongo.connect();

			return db.collection(this.collection).findOne(params);
		} catch(error) {
			return error.message;
		}
	}
};
