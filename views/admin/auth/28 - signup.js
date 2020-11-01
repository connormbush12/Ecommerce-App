//now, we require layout in so that we can use it
const layout = require('../layout')
module.exports = ({ req }) => {
    //instead of returning the string directly, we use the layout function and pass through an object with the key name content and our HTML code as its value
	return layout({content:`
    <div>
	Your ID is: ${req.session.userID}
		<form method="POST">
			<input name="email" placeholder="email"/>
			<input name="password" placeholder="password"/>
			<input name="passwordConfirmation" placeholder="password confirmation"/>
			<button>Sign Up</button>
		</form>
	</div
    `});
};
