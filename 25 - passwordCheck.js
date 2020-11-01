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

app.get('/signin', (req, res) => {
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

//To check our passwords, we go to our post listener for signing in
app.post('/signin', async (req, res) => {
	const { email, password } = req.body;
	const user = await usersRepository.getOneBy({ email });
	if (!user) {
		return res.send('Email not found');
	}
	//Instead of a basic if statement, we create a variable equal to the result of our comparePasswords function between user.password (the saved password from our account) and password (our inputted password we pull from req.body)
	//.comparePasswords() returns a true or false
	const validPassword = await usersRepository.comparePasswords(user.password, password);
	//If validPassword is not true, that means the passwords didn't match and we returned false, so we want to send an error message
	if (!validPassword) {
		return res.send('Incorrect password');
	}
	req.session.userID = user.id;
	res.send('You are signed in!');
});

app.listen(3000, () => {
	console.log('Listening');
});
