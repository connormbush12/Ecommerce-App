const express = require('express');
const bodyParser = require('body-parser');

//First, we have to require in our users.js file to get access to our UsersRepository
const usersRepository = require('./repositories/users');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send(`
	<div>
		<form method="POST">
			<input name="email" placeholder="email"/>
			<input name="password" placeholder="password"/>
			<input name="passwordConfirmation" placeholder="password confirmation"/>
			<button>Sign Up</button>
		</form>
	</div
	`);
});

//Since a lot of our methods on UsersRepository is async, we want to add in async here
app.post('/', async (req, res) => {
	//We want to destructure out the email, password, and passwordConfirmatoin from our request body
	const { email, password, passwordConfirmation } = req.body;

	//First, we want to make sure that the email isn't in use. We create an existingUser variable and use the .getOneBy() method to see if there is an existing user that has the email we inputted.
	const existingUser = await usersRepository.getOneBy({ email });

	//If no user existed with that email, the getOneBy() method will return undefined, existingUser will be undefined, and this if statement will be false. If the user exists, then it will return that user and this variable will have a value (and thus this if statement will be true)
	if (existingUser) {
		//If that occurs, we want to stop the execution of the function (return) and send an error message
		return res.send('Email already in use');
	}
	//Now, we do the same thing, but instead we check to see if the password and passwordConfirmation were both the same
	if (password !== passwordConfirmation) {
		return res.send('Passwords do not match');
	}
	//If it gets past both of those checks, then an account is created!
	res.send('Account Created!!!');
});

app.listen(3000, () => {
	console.log('Listening');
});
