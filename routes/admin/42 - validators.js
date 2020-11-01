const {check} = require('express-validator');
const usersRepository = require('../../repositories/users')

//We want to create two more validators for when we create new products for our product title and product price.
module.exports = {
    //For our title, we trim it and then give it a length requirement. This length requirement is a bit arbitrary (minimum length of 5 characters and a max of 40)
	requireTitle : check('title')
	.trim()
	.isLength({min:5, max:40})
	.withMessage('Title must be between 5 and 40 characters'),
    //Then, for our price, we trim it as well. We also sanitize it using .toFloat(). This converts the string into a float number (with decimals) if possible. Finally, we use the validation method .isFloat(). isFloat() checks whether or not the info is a number or is a string. If the user inputted a number (like 10.50) when creating the product, then .toFloat() will convert that into a float number, and .isFloat() will validate that it is a float number. However, if the user inputted a word (like "ten fifty"), then .toFloat() won't work and then .isFloat() will catch an error. The options object for .isFloat() specifies a minimum number value. So in this case, we are saying our minimum dollar price is $1
	requirePrice : check('price')
	.trim()
	.toFloat()
	.isFloat({min:1})
	.withMessage('Price must be a number greater than 1'),
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