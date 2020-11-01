const express = require('express');
const usersRepository = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {check, validationResult} = require('express-validator')

//Now, within our auth.js file, we require in our code from our validators.js file we just created. We will destructure out requireEmail, requirePassword, and requirePasswordConfirmation
const {requireEmail, requirePassword, requirePasswordConfirmation} = require('./validators')

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

//Now, within our .post handler, we simply include within our Middleware array our three validator checks. This cleans up our code considerably to make it easier to follow
router.post('/signup', [requireEmail, requirePassword, requirePasswordConfirmation], async (req, res) => {
	const errors = validationResult(req);
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
