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

//First, we want to change this path from just nomral / to /signup
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

//Want to change this one to /signup as well
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

//To sign out, we make a new .get() with a path of /signout
app.get('/signout', (req, res) => {
	//Essentially, when we sign out, we want the browser to forget the cookie information. Then, the next time we make a request to the site, it'll be a blank cookie and the server will not recognize the user, essentially being signed out
	//To do this, we set req.session equal to null
	req.session = null;
	//Then, we simply send the message that we signed out
	res.send('You are signed out');
});

app.listen(3000, () => {
	console.log('Listening');
});
