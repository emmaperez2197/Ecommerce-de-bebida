module.exports = async (schema, body) => {

	const value = schema.validate(body);

	return value.error ? { error: value.error.message } : {};
};
