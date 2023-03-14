const Model = require('../../modules/class/Model');

class Producto extends Model {

	constructor({
		name, description = '', imageUrl, brandName, style, ibu, abv, price, inStock, isVisible = true, launchDate = ''
	}
	) {
		super();
		this.name = name;
		this.description = description;
		this.imageUrl = imageUrl;
		this.brandName = brandName;
		this.attributes = { style, ibu, abv };
		this.price = price;
		this.inStock = inStock;
		this.isVisible = isVisible;
		this.launchDate = launchDate.length !== 0 ? new Date(launchDate) : '';
		this.status = Model.statuses.active;

	}

	static get collection() {
		return 'productos';
	}

	get collection() {
		return 'productos';
	}

	static instantiate(obj) {
		return new Producto(obj);
	}
}

module.exports = Producto;
