#!/usr/bin/env node

'use strict';

const ApiSchemaBuilder = require('./lib');

(async () => {
	const apiSchemaBuilder = new ApiSchemaBuilder();
	await apiSchemaBuilder.build();
})();
