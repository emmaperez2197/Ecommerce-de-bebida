const express = require('express');

const app = express.Router();

const ExampleModel = require('../../../models/Example');
const schemaCreate = require('../../../structures/example/create');

const handler = async (req, res) => {

	const validation = await schemaCreate(req.body);

	if(validation.error)
		return res.status(400).json(validation);

	const example = new ExampleModel({ name: 'Marcos' });

	try {
		const exampleInserted = await example.insert();

		res.status(200).json({ exampleInserted: exampleInserted.insertedId });
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', handler);

module.exports = { app, handler };
