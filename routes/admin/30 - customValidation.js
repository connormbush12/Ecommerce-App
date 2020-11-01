const express = require('express');
const usersRepository = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {check, validationResult} = require('express-validator')

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

router.post('/signup', [
	check('email')
	.trim()
	.normalizeEmail()
	.isEmail()
	.withMessage('Must be a valid email')
	//Ideally, we have all of our validation occurring in the same place; therefore, we want to move our existingUser validation and password confirmation validation into the express-validator middleware. We can do this by using .custom
	//For .custom, we simply pass through a callback function that gives the validation code that we need. Therefore, we just copy and paste the code we had below for checking to see if a user already existed into here.
	.custom(async (email) => {
		const existingUser = await usersRepository.getOneBy({ email });
		if (existingUser) {
			//Now, instead of res.send, we just throw an error
			throw new Error('Email already in use');
		}
	}),
	check('password')
	.trim()
	.isLength({min:4, max:20})
	.withMessage('Must be a minimum of four characters and a maximum of twenty characters'),
	check('passwordConfirmation')
	.trim()
	.isLength({min:4, max:20})
	.withMessage('Must match password')
	//We do the same with our password confirmation check as well
	.custom(async (passwordConfirmation, {req}) => {
		console.log(passwordConfirmation, req.body.password)
		if (passwordConfirmation !== req.body.password) {
			throw new Error('Passwords do not match');
		}
	})
], async (req, res) => {
	const errors = validationResult(req);
	//Right now, we are only console.logging the errors, so even if they are incorrect, they will still create a user
	console.log(errors)

	const { email, password, passwordConfirmation } = req.body;


	const user = await usersRepository.create({ email, password });
	req.session.userID = user.id;
	res.send('Account Created!!!');
});

router.get('/signout', (req, res) => {
	req.session = null;
	res.send('You are signed out');
});

router.get('/signin', (req, res) => {
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
