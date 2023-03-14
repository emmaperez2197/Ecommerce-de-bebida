const assert = require('assert');
const ExampleModel = require('../../src/models/Example');

const compareData = (model, data) => {

	assert.deepStrictEqual(model.name, data.name);
	assert.deepStrictEqual(model.age, data.age);
};

describe('Test Area Model', () => {

	const data = {
		name: 'Fake Marcos',
		age: 22
	};

	it('Create Example Model', async () => {

		const exampleModel = new ExampleModel(data);
		compareData(exampleModel, data);
	});

	it('Should return "voices" when execute the collection function', () => {

		const { collection } = ExampleModel;
		assert.deepStrictEqual(collection, 'examples');
	});

	it('Should return "voices" when execute the collection instantiated function', () => {

		const voiceModel = new ExampleModel(data);
		const { collection } = voiceModel;

		assert.deepStrictEqual(collection, 'examples');
	});

	it('Should return an instantiated object when execute the "instantiate" function', () => {
		const user = ExampleModel.instantiate(data);

		compareData(user, data);
	});
});
