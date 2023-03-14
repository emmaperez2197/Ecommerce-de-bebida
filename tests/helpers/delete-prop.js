const deleteProp = (object, prop) => {
	const { [prop]: propToRemove, ...newObject } = object;
	return newObject;
};
module.exports = deleteProp;
