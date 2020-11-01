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

//Now we do our validations for signing in. We'll start by putting the code here and then refactor it into our validators.js file afterwards
router.post('/signin', [
    //At first, we want to sanitize and validate our email with the same checks we used while signing up
	check('email')
	.trim()
	.normalizeEmail()
	.isEmail()
    .withMessage('Must be a valid email')
    //Then, we do our custom check to make sure the user exists in our user repository. If the user doesn't exist, then it should throw an error
	.custom(async (email) => {
		const user = await usersRepository.getOneBy({ email });
		if (!user) {
			throw new Error('Email not found');
		}
    }),
    //We do the same thing below, except we don't check for password length this time. It's possible that we could change our length requirements over time, which would make users who signed up with different length requirements unable to sign in if we did a validator check for it here.
	check('password')
    .trim()
    // At this point, all we really care about is if the password typed in matches the one saved. If it doesn't, then we'll throw an error.
    //For this .custom(), we pass through the password, but also the req object so that we can pull the email entered above off of it
	.custom(async (password, {req}) => {
        //First, we have to do the same check as we did above for our user. It's possible that if we miss something up there, then user can be undefined and we'd get an error for looking for the user.password with an undefined user
		const user = await usersRepository.getOneBy({ email : req.body.email });
		if(!user) {
			throw new Error('Incorrect password')
        }
        //Now, we input our validPassword check that we had previously
		const validPassword = await usersRepository.comparePasswords(user.password, password);
		if (!validPassword) {
			throw new Error('Incorrect password');
		}
	})
], async (req, res) => {
    const { email } = req.body;
    //Finally, we use validationResult() again here and console.log the errors to make sure it works
	const errors = validationResult(req);
	console.log(errors)
	const user = await usersRepository.getOneBy({ email });
	
	
	req.session.userID = user.id;
	res.send('You are signed in!');
});

module.exports = router;
