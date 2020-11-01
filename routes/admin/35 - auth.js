const express = require('express');
const usersRepository = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {check, validationResult} = require('express-validator')
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
//One tiny change here = want to pass through an empty obejct into our signinTemplate now that it tries to destructure errors from it so that we don't get an error
router.get('/signin', (req, res) => {
	res.send(signinTemplate({}));
});

router.post('/signin', [requireEmailExists, requireValidPasswordForUser], async (req, res) => {
	const { email } = req.body;
	const errors = validationResult(req);
    
    //Now, within our signin post listener, we do the same thing we did above for our signup post listener -> see if it is empty, if it isn't, we return the signinTemplate with the errors passed through
	if(!errors.isEmpty()) {
		return res.send(signinTemplate({errors}))
	}
	const user = await usersRepository.getOneBy({ email });
	
	
	req.session.userID = user.id;
	res.send('You are signed in!');
});

module.exports = router;
