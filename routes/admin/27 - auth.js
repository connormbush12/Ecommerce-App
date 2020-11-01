const express = require('express');
const usersRepository = require('../../repositories/users');
//First, we have to create our signupTemplate and signinTemplate functions by requiring in the information from our files
//We use their relative path, so we have to jump out of the admin folder, out of the routes folder, and then into the views, admin, and auth folders, and finally put the file name
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
	//we keep our res.send, but instead of hardcoding all of the HTML, we use the signupTemplate function we created
	//We pass through the req obejct as well, inside of an object, so that we can destructure it out
	res.send(signupTemplate({ req }));
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
	//same thing here, we keep our res.send, but instead of hardcoding all of the HTML, we use the signinTemplate function we created
	//After this, check our site to make sure both the signin and signup pages still work`
	res.send(signinTemplate());
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

module.exports = router;
