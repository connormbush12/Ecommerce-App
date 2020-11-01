//We want to refactor our validation code out of our auth.js file so that it's easier to follow and not so cluttered. Therefore, we create a validators.js file within our same routes->admin folder

//First, we require in check for express-validator and usersRepository because we use both of those within our validators
const {check} = require('express-validator');
const usersRepository = require('../../repositories/users')

//Then, we module.exports an object that has the validation code for each of our validators
module.exports = {
    //We assign it a key (such as requireEmail), and simply cut and paste in the validation code we had in our auth.js file as the value
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
    //We repeat again for both requirePassword and requirePasswordConfirmation
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
	})
}