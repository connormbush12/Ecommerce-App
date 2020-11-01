const express = require('express');
const usersRepository = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

//First, we require in express-validator. Express-validator has a lot of different Middleware that we can use, but we only want to use two of them for now: check and validationResult
const {check, validationResult} = require('express-validator')

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

//To use the middleware that we requested from express-validator, we pass in an array inbetween our path and callback that contains our express-validator code
router.post('/signup', [
    //We need to validate and sanitize three pieces of info: the email, password, and password confirmation
    //For the email, we use check on the email to do a few things. First, we sanitize it with .trim(), which eliminates leading and trailing spaces. Then we sanitize it with normalizeEmail(), which gets rid of unneccessary characters in the email. Then, we validate to see if it is a valid email by using isEmail(). If we get an error, it will send whatever message we pass through .withMessage()
    check('email').trim().normalizeEmail().isEmail().withMessage('Must be a valid email'),
    //We do similar things for both the password and passwordConfirmation. In addition to trimming, we give a required minimum and maximum length
	check('password').trim().isLength({min:4, max:20}).withMessage('Must be a minimum of four characters and a maximum of twenty characters'),
	check('passwordConfirmation').trim().isLength({min:4, max:20}).withMessage('Must match password')
], async (req, res) => {
    //Finally, to see whatever errors we receive during validation, we use validationResult() and console.log the errors. Whenever we get any errors above, it appends that information onto the req object. Therefore, we use validationResult() with req passed through to get that information.
	const errors = validationResult(req);
	console.log(errors)

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
