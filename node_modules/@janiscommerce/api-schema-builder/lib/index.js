'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const { get, set, merge } = require('lodash');
const YAML = require('js-yaml');
const jsonRefs = require('json-refs');
// In order to use OpenApi Schema Validator 3.0.3+
const OpenapiSchemaValidator = require('openapi-schema-validator').default;

// Promisify methods
['readdir', 'stat', 'readFile', 'writeFile', 'mkdir'].forEach(method => { fs[method] = util.promisify(fs[method]); });

const SCHEMA_DIR = 'schemas';
const SRC_DIR = 'src';
const BUILD_FILE = 'public.json';
const LOG_ERROR_FILE = 'build-error.log';

/**
 * Simple Console Log
 * @param {string} message
 * @param {string} prefix DEFAULT = 'BUILDING'
 * @param {boolean} error if it's an error message
 */
/* istanbul ignore next */
const logger = (message, prefix = 'BUILDING', error = false) => {
	const time = new Date().toLocaleTimeString();

	/*
		/x1b[**m -> text editor codes
		/x1b[35m = Magenta
		/x1b[32m = Green
		/x1b[31m = Red
		/x1b[1m = Bright
		/x1b[0m = Reset, back to normal
	 */

	if(error) {
		console.error(`[\x1b[35m \x1b[1mAPI-SCHEMA-BUILDER\x1b[0m | ${time} ] | \x1b[31m${prefix}\x1b[0m | ${message}`);
		console.error(`[\x1b[35m \x1b[1mAPI-SCHEMA-BUILDER\x1b[0m | ${time} ] | \x1b[31mERROR\x1b[0m | Abort. Can't create SCHEMAS.\n`);
	} else
		console.log(`[\x1b[35m \x1b[1mAPI-SCHEMA-BUILDER\x1b[0m | ${time} ] | \x1b[32m${prefix}\x1b[0m | ${message}`);
};

class ApiSchemaBuilder {

	static get schemaSrcDir() {
		return path.join(process.cwd(), SCHEMA_DIR, SRC_DIR);
	}

	static get schemaDir() {
		return path.join(process.cwd(), SCHEMA_DIR);
	}

	static get buildFile() {
		return path.join(process.cwd(), SCHEMA_DIR, BUILD_FILE);
	}

	static get errorLog() {
		return path.join(process.cwd(), SCHEMA_DIR, LOG_ERROR_FILE);
	}

	/**
	 * Builds the JSON schemas and outputs in the /build folder
	 * @async
	 */
	async build() {
		logger('Building Schemas', 'START');

		// Check if base path is a correct directory
		if(!await this._isDirectory(this.constructor.schemaDir)) {
			logger('Directory \'schemas/\' don\'t exist. Need to build.', 'ERROR', true);
			return process.exit(-1);
		}

		logger('Directory \'schemas/\' found.');

		// Check if source path is a correct directory
		if(!await this._isDirectory(this.constructor.schemaSrcDir)) {
			logger('Directory \'schemas/src/\' don\'t exist. Need to build.', 'ERROR', true);
			return process.exit(-1);
		}

		logger('Directory \'schemas/src/\' found.');

		try {
			logger('Searching SRC structure');
			const tree = await this._getSourceTree();
			const schemaTypes = Object.keys(tree);

			if(!schemaTypes.length) {
				logger('No Files to Build', 'ERROR', true);
				return process.exit(-1);
			}

			logger('Validating files.');
			for(const key of schemaTypes)
				await this._buildSchema(key, tree[key]);

			logger('Schemas Build in \'schemas/public.json\'', 'SUCCESS');
		} catch(error) {
			logger(error.message, 'ERROR', true);
			return process.exit(-1);

		}
	}

	/**
	 * Checks if the route is a folder
	 * @async
	 * @param {string} directory
	 * @returns {boolean} If not exist return False.
	 */
	async _isDirectory(directory) {

		try {
			const stats = await fs.stat(directory);
			return stats.isDirectory();
		} catch(error) {
			// If directory not even exist
			return false;
		}
	}

	/**
	 * Retrieves the schemas source tree path, from 'SRC_DIR'
	 * @async
	 * @param {string} directory
	 * @param {array} parentChain
	 * @param {object} tree
	 * @return {object}
	 */

	async _getSourceTree(directory = this.constructor.schemaSrcDir, parentChain = [], tree = {}) {

		// Check if path is a correct directory
		if(!await this._isDirectory(directory))
			throw new Error(`Path: ${directory}, don't exist or isn't a directory`);

		// Take the file or directory
		const content = await fs.readdir(directory);

		for(const element of content) {

			const elementChain = parentChain.concat(element);
			const elementPath = `${this.constructor.schemaSrcDir}/${elementChain.join('/')}`;

			const isDir = await this._isDirectory(elementPath);

			if(isDir) {
				// If is an directory
				const elementPropertyChain = elementChain.join('.nodes.');
				const elementTree = get(tree, elementPropertyChain);

				if(!elementTree)
					set(tree, elementPropertyChain, { nodes: {}, schemas: [] });

				// Recursively fill the tree with the sub directories nodes and schemas
				await this._getSourceTree(elementPath, elementChain, tree);
			} else {
				// If is a File
				const parentPropertyChain = parentChain.join('.nodes.');
				const elementTree = get(tree, parentPropertyChain);

				// If there is a file in the root, otherwise crash
				if(elementTree)
					set(tree, `${parentPropertyChain}.schemas`, elementTree.schemas.concat(elementPath));
			}
		}

		return tree;
	}

	/**
	 * Retruns the list of paths from a schemaTree
	 * @param {Object} schemaTree The object with the schemas source tree file paths
	 * @param {Array<string>} schemaPathsList The list of paths to return
	 */
	_getSchemaPathsList(schemaTree, schemaPathsList = []) {
		const { nodes, schemas } = schemaTree;

		// mutate the schemaList array
		schemas.forEach(s => schemaPathsList.push(s));

		if(Object.keys(nodes).length) {
			for(const key of Object.keys(nodes))
				// Recursively mutate the schemaPathList with all of the modules
				this._getSchemaPathsList(nodes[key], schemaPathsList);
		}

		return schemaPathsList;
	}

	/**
	 * Parses the content of a file
	 * @param {string} fileType The file type extension
	 * @param {string} fileContent The string with the file content
	 */
	_parseFile(fileType, fileContent, filepath) {
		switch(fileType) {
			case 'yml':
			case 'yaml':
				try {
					return YAML.safeLoad(fileContent, { filename: filepath });
				} catch(error) {
					throw new SyntaxError(`${error.message} Line ${error.parsedLine}.`);
				}
			case 'json':
				return JSON.parse(fileContent);
			default:
				return null;
		}
	}

	/**
	 * Retrieves the content of the schema file paths
	 * @async
	 * @param {Array<string>} schemaPaths The list of schemas file paths
	 * @return {Array{object}}
	 */
	_readSchemaFiles(schemaPaths) {
		return Promise.all(schemaPaths.map(async pathname => {
			const fileType = pathname.split('.').pop();
			const file = await fs.readFile(pathname, 'utf8');

			try {
				const parsedFile = this._parseFile(fileType, file, pathname);
				return parsedFile;
			} catch(error) {
				error.message = `Invalid file ${pathname}, not a valid ${fileType.toUpperCase()}. ${error.message}`;
				throw error;
			}
		}));
	}

	/**
	 * Merges the schemas into a single object
	 * @param {Array<Object>} schemas The list of schemas parts to merge
	 */
	_mergeSchemas(schemas) {
		const mergedSchemas = {};

		merge(mergedSchemas, ...schemas);

		return mergedSchemas;
	}

	/**
	 * Validates if a schema is compliant with the specification
	 * @async
	 * @param {string} schemaType The type of the schema like "public"
	 * @param {Object} schema The final schema object
	 */
	async _validateSchema(schemaType, schema) {

		const schemaValidator = new OpenapiSchemaValidator({ version: 3 });
		const results = schemaValidator.validate(schema);

		if(!results.errors.length)
			return;
		// If Schemas has an error
		try {
			await fs.writeFile(this.constructor.errorLog, JSON.stringify({ [schemaType]: results }, null, '\t'));
		} catch(error) {
			// if can't make a file
			throw new Error(`Found errors on schema of type "${schemaType}". Can't Write build-error.log file `);
		}

		throw new Error(`Found errors on schema of type "${schemaType}". Check build-error.log file for more details`);
	}

	/**
	 * Builds the schema by type and writes the JSON file in the buildPath
	 * @param {string} schemaType The type of the schema like "public"
	 * @param {Object} schemaTree The schema tree with the schema file paths and modules
	 */
	async _buildSchema(schemaType, schemaTree) {
		const schemaPaths = this._getSchemaPathsList(schemaTree);
		const schemaObjects = await this._readSchemaFiles(schemaPaths);
		const schema = this._mergeSchemas(schemaObjects);

		const resolvedSchemaResult = await jsonRefs.resolveRefs(schema, {
			filter: ['relative', 'remote'],
			// Search files in base directory: 'root/schemas/src/${schemaType}/'
			location: `${this.constructor.schemaSrcDir}/${schemaType}/${schemaType}.json`,
			loaderOptions: {
				processContent: (content, callback) => {
					if(content.location.match(/\.ya?ml$/i))
						return callback(undefined, YAML.safeLoad(content.text, { filename: content.location }));
					return callback(undefined, JSON.parse(content.text));
				}
			}
		});

		const resolvedSchema = resolvedSchemaResult.resolved;

		await this._validateSchema(schemaType, resolvedSchema);

		try {
			await fs.writeFile(this.constructor.buildFile, JSON.stringify(resolvedSchema, null, '\t'));
		} catch(error) {
			throw new Error(`Can't make the file 'public.json'. ${error.message}.`);
		}
	}

}

module.exports = ApiSchemaBuilder;
