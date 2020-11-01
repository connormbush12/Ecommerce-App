const express = require('express');

//Since we pulled out our error handling and our validation checks to separate files, we no longer need to require in express-validator here

const usersRepository = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPasswordForUser} = require('./validators')
//To use our error handler, we require in our middlewares file and destructure out handleErrors
const {handleErrors} = require('./middlewares')

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

router.post('/signup',
[requireEmail, requirePassword, requirePasswordConfirmation],
//handleErrors needs to occur after our parsing and our validation checks have been completed. We pass through the signupTemplate itself (without the ()). If we typed in signupTemplate(), we would be passing through the result of that function executing, which is not what we want. We want the function itself, which is then used in the way we want within our middleware
handleErrors(signupTemplate),
 async (req, res) => {
	 //Here, we can delete our previous error handling code. We can also get rid of passwordConfirmation variable as we don't use it here anymore
	const { email, password } = req.body;

	const user = await usersRepository.create({ email, password });
	req.session.userID = user.id;
	res.send('Account Created!!!');
});

router.get('/signout', (req, res) => {
	req.session = null;
	res.send('You are signed out');
});

router.get('/signin', (req, res) => {
	res.send(signinTemplate({}));
});

router.post('/signin',
[requireEmailExists, requireValidPasswordForUser],
//We repeat the same thing here for signin
handleErrors(signinTemplate),
async (req, res) => {
	const { email } = req.body;
	const user = await usersRepository.getOneBy({ email });
	
	req.session.userID = user.id;
	res.send('You are signed in!');
});

module.exports = router;
