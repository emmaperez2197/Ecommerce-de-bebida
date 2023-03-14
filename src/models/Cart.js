const Model = require('../../modules/class/Model');

class Cart extends Model {

	constructor(email) {
		super();
		this.email = email;
		this.items = [];
		this.status = Model.statuses.active;

	}

	static get collection() {
		return 'carts';
	}

	get collection() {
		return 'carts';
	}

	static instantiate(obj) {
		return new Cart(obj);
	}
}

module.exports = Cart;
