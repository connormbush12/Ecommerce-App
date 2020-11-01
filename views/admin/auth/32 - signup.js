const layout = require('../layout')

//We want to create a helper function that allows us to display the errors on our signup form whenever they occur without causing issues when we first access the signup page
//Within this function, we'll need our errors array and the property name
const getError = (errors, property) => {
    //If we try to access an error when it isn't there, the try block will fail and it will go to catch. As opposed to using a bunch of if statements to capture every corner case, this method is a bit easier
	try {
        //First, we want to try and return the error message. Currently, errors from validationResult() is an array with an object in it for each error. .mapped() is a method for validationResult that returns an object where the keys are the field names, and the values are the validation errors.
        //Once we have that object, we access the field name by inputting the property ('email', 'password', or 'passwordConfirmation')
        //Finally, we access the .msg on that property, which is our error message
        return errors.mapped()[property].msg
        //If anything goes wrong, most likely meaning we either have no errors or we don't have an error for that property, when we catch the err and simply return an empty string
	} catch (err) {
		return ''
	}
}

//Now, we have to export the errors as well .We input the getError() function with the errors array and the property name following each input box. If there was an error for that item, then it will display right after that input box. If there isn't, then we'll simply get an empty string
module.exports = ({ req, errors }) => {
	return layout({content:`
    <div>
	Your ID is: ${req.session.userID}
		<form method="POST">
            <input name="email" placeholder="email"/>
			${getError(errors, 'email')}
			<input name="password" placeholder="password"/>
			${getError(errors, 'password')}
			<input name="passwordConfirmation" placeholder="password confirmation"/>
			${getError(errors, 'passwordConfirmation')}
			<button>Sign Up</button>
		</form>
	</div
    `});
};
