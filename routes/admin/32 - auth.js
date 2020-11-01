const express = require('express');
const usersRepository = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {check, validationResult} = require('express-validator')
const {requireEmail, requirePassword, requirePasswordConfirmation} = require('./validators')

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

router.post('/signup', [requireEmail, requirePassword, requirePasswordConfirmation], async (req, res) => {
    const errors = validationResult(req);
    //Now, as opposed to console.logging our errors, we can display them so an account is not created when there is a mistake.
    //First, we use an if statement to see if the errors array has anything inside it. .isEmpty is a method on validationResult() that returns a boolean indicating whether this result object contains no errors at all
    //If there are no errors, this errors array will be empty, making this if statement not true, and skipping over it to create the account
	if (!errors.isEmpty()) {
        //If it isn't empty, then we will return the original signup template HTML with our errors included in it.
		return res.send(signupTemplate({ req, errors }));
	}

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
