//Then, we need to check to make sure that any programs or external libraries we refer to, we require
//Therefore, we need to require express and our usersRepository
const express = require('express');
//For usersRepository, the .. goes up a directory. So we go up out of our admin folder, up out of our routes folder, and then into repositories and into users
const usersRepository = require('../../repositories/users');

//In order to use the app we created in our index.js file, we use a subrouter. The subrouter is essentially making a separate app that we link up with our app in the index.js file
//We use express.Router() to create our subrouter
const router = express.Router();

//Very first thing we do is cut and paste the five route handlers we have into this auth.js file
//Then, after creating our router, we replace 'app' with 'router' for all five our the route handlers
router.get('/signup', (req, res) => {
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

router.post('/signup', async (req, res) => {
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

router.get('/signout', (req, res) => {
	req.session = null;
	res.send('You are signed out');
});

router.get('/signin', (req, res) => {
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

router.post('/signin', async (req, res) => {
	const { email, password } = req.body;
	const user = await usersRepository.getOneBy({ email });
	if (!user) {
		return res.send('Email not found');
	}
	const validPassword = await usersRepository.comparePasswords(user.password, password);
	if (!validPassword) {
		return res.send('Incorrect password');
	}
	req.session.userID = user.id;
	res.send('You are signed in!');
});

//Finally, we modulue.exports our router so that we can require it in our main index.js file

module.exports = router;
