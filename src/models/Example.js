const Model = require('../../modules/class/Model');

class Example extends Model {

	constructor({ name, age }) {
		super();
		this.name = name;
		this.age = age;
		this.status = Model.statuses.active;
	}

	static get collection() {
		return 'examples';
	}

	get collection() {
		return 'examples';
	}

	static instantiate(obj) {
		return new Example(obj);
	}
}

module.exports = Example;
