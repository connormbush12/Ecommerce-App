//do a modulue.exports of a function to return the HTML code needed
//because we use req.session.userID below, we need to pass through req as an argument
//as opposed to passing through just req, we will pass through an object that we destructure req from. This makes it easier, so in the future if we need to add more arguments, we can just continue to destructure them out of one single object as opposed to needing to pass through a bunch of new arguments every time we run a function
module.exports = ({ req }) => {
	//simply return the HTML code from auth.js for signing in
	return `
    <div>
	Your ID is: ${req.session.userID}
		<form method="POST">
			<input name="email" placeholder="email"/>
			<input name="password" placeholder="password"/>
			<input name="passwordConfirmation" placeholder="password confirmation"/>
			<button>Sign Up</button>
		</form>
	</div
    `;
};
