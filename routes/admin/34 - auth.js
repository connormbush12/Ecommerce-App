const express = require('express');
const usersRepository = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {check, validationResult} = require('express-validator')
//Now, we require in our two other validators that we just added to our validators.js file
const {requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPasswordForUser} = require('./validators')

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

router.post('/signup', [requireEmail, requirePassword, requirePasswordConfirmation], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
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

//Then, we add them in as middleware for our sign in page
router.post('/signin', [requireEmailExists, requireValidPasswordForUser], async (req, res) => {
	const { email } = req.body;
	const errors = validationResult(req);
	console.log(errors)
	const user = await usersRepository.getOneBy({ email });
	
	
	req.session.userID = user.id;
	res.send('You are signed in!');
});

module.exports = router;
