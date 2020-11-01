//to extract out the getError function, we put it in its own file, use modulue.exports, and then put it in an object.
//In an object, we can continue to add more helper functions to it
module.exports = {getError(errors, property) {
	try {
		return errors.mapped()[property].msg
	} catch (err) {
		return ''
	}
}}