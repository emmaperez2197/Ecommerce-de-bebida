const assert = require('assert');
const ProductoModel = require('../../src/models/Producto');

const compareData = (model, data) => {

	assert.deepStrictEqual(model.name, data.name);
	assert.deepStrictEqual(model.description, data.description);
	assert.deepStrictEqual(model.imageUrl, data.imageUrl);
	assert.deepStrictEqual(model.brandName, data.brandName);
	assert.deepStrictEqual(model.attributes.style, data.style);
	assert.deepStrictEqual(model.attributes.ibu, data.ibu);
	assert.deepStrictEqual(model.attributes.abv, data.abv);
	assert.deepStrictEqual(model.price, data.price);
	assert.deepStrictEqual(model.inStock, data.inStock);
	assert.deepStrictEqual(model.isVisible, data.isVisible);
	assert.deepStrictEqual(model.launchDate, data.launchDate);
};

const dataRequired = (model, data) => {
	assert.deepStrictEqual(model.name, data.name);
	assert.deepStrictEqual(model.description, '');
	assert.deepStrictEqual(model.imageUrl, data.imageUrl);
	assert.deepStrictEqual(model.brandName, data.brandName);
	assert.deepStrictEqual(model.attributes.style, data.style);
	assert.deepStrictEqual(model.attributes.ibu, data.ibu);
	assert.deepStrictEqual(model.attributes.abv, data.abv);
	assert.deepStrictEqual(model.price, data.price);
	assert.deepStrictEqual(model.inStock, data.inStock);
	assert.deepStrictEqual(model.isVisible, true);
	assert.deepStrictEqual(model.launchDate, '');

};

describe('Test Producto Model', () => {

	const data = {
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
		launchDate: new Date('2022/03/30')
	};

	const { description, isVisible, launchDate, ...onlyFieldsRequired } = data;

	it('Create Producto Model', async () => {

		const productoModel = new ProductoModel(data);
		compareData(productoModel, data);
	});

	it('Should return a product object if everything was created ok', async () => {

		const collectionRequired = new ProductoModel(onlyFieldsRequired);
		dataRequired(collectionRequired, onlyFieldsRequired);
	});

	it('Should return "productos" when execute the collection function', () => {

		const { collection } = ProductoModel;
		assert.deepStrictEqual(collection, 'productos');
	});

	it('Should return "productos" when execute the collection instantiated function', () => {

		const voiceModel = new ProductoModel(data);
		const { collection } = voiceModel;

		assert.deepStrictEqual(collection, 'productos');
	});

	it('Should return an instantiated object when execute the "instantiate" function', () => {
		const user = ProductoModel.instantiate(data);

		compareData(user, data);
	});
});
