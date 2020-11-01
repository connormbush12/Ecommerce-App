const layout = require('../layout')

//Now, as opposed to defining the getError function here, we require it in from our helpers file
const {getError} = require('../../helpers')


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
