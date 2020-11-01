const {check} = require('express-validator');
const usersRepository = require('../../repositories/users')

module.exports = {
    requireEmail : check('email')
	.trim()
	.normalizeEmail()
	.isEmail()
	.withMessage('Must be a valid email')
	.custom(async (email) => {
		const existingUser = await usersRepository.getOneBy({ email });
		if (existingUser) {
			throw new Error('Email already in use');
		}
    }),
    requirePassword : check('password')
	.trim()
	.isLength({min:4, max:20})
    .withMessage('Must be a minimum of four characters and a maximum of twenty characters'),
    requirePasswordConfirmation : check('passwordConfirmation')
	.trim()
	.isLength({min:4, max:20})
	.withMessage('Must match password')
	.custom(async (passwordConfirmation, {req}) => {
		console.log(passwordConfirmation, req.body.password)
		if (passwordConfirmation !== req.body.password) {
			throw new Error('Passwords do not match');
		}
	}),
	//Now, do the same thing as we did before by making two more object keys that match our validator code by cutting and pasting from auth.js
	requireEmailExists : check('email')
	.trim()
	.normalizeEmail()
	.isEmail()
	.withMessage('Must be a valid email')
	.custom(async (email) => {
		const user = await usersRepository.getOneBy({ email });
		if (!user) {
			throw new Error('Email not found');
		}
	}),
	requireValidPasswordForUser : check('password')
	.trim()
	.custom(async (password, {req}) => {
		const user = await usersRepository.getOneBy({ email : req.body.email });
		if(!user) {
			throw new Error('Incorrect password')
		}
		const validPassword = await usersRepository.comparePasswords(user.password, password);
		if (!validPassword) {
			throw new Error('Incorrect password');
		}
	})
}