const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepository = require('./repositories/users');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: [ 'asfjaopifjvnpoifcnehoiruaeoirywe' ]
	})
);

app.get('/signup', (req, res) => {
	res.send(`
	<div>
	Your ID is: ${req.session.userID}
		<form method="POST">
			<input name="email" placeholder="email"/>
			<input name="password" placeholder="password"/>
			<input name="passwordConfirmation" placeholder="password confirmation"/>
			<button>Sign Up</button>
		</form>
	</div
	`);
});

app.post('/signup', async (req, res) => {
	const { email, password, passwordConfirmation } = req.body;
	const existingUser = await usersRepository.getOneBy({ email });
	if (existingUser) {
		return res.send('Email already in use');
	}
	if (password !== passwordConfirmation) {
		return res.send('Passwords do not match');
	}
	const user = await usersRepository.create({ email, password });
	req.session.userID = user.id;
	res.send('Account Created!!!');
	console.log(user);
	console.log(req.session.userID);
});

app.get('/signout', (req, res) => {
	req.session = null;
	res.send('You are signed out');
});

//In order to sign in, we once again use app.get(), this time with a /signin path
app.get('/signin', (req, res) => {
	//We create a form similar to our sign up form, except don't include a password confirmation and change the button to "Sign In"
	res.send(`
	<div>
		<form method="POST">
			<input name="email" placeholder="email"/>
			<input name="password" placeholder="password"/>
			<button>Sign In</button>
		</form>
	</div
	`);
});

//Then, we have a .post listener as well
app.post('/signin', async (req, res) => {
	//First, we pull the email and password we submitted in our form to req.body
	const { email, password } = req.body;
	//Then, we have to retrieve our user information. We use our usersRepository method .getOneBy and pass through the email that we inputted into our sign in form. We then save this to a variable
	const user = await usersRepository.getOneBy({ email });
	//If the user doesn't exist, that means our .getOneBy() wasn't successful, so we need to return the function (to end execution) and send the error message
	if (!user) {
		return res.send('Email not found');
	}
	//Next, we check if the password on the user we retrieved using .getOneBy() matches the password typed in and stored on the req.body.
	if (user.password !== password) {
		return res.send('Incorrect password');
	}
	//If both the email and password are valid, then we grab our cookie using the req.session object and assign the userID attribute to be equal to the ID for that user account. Now, they have the same cookie they had when they signed up, so they are signed into their account
	req.session.userID = user.id;
	res.send('You are signed in!');
});

app.listen(3000, () => {
	console.log('Listening');
});
