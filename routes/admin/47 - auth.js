const express = require('express');

const usersRepository = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPasswordForUser} = require('./validators')
const {handleErrors} = require('./middlewares')

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

router.post('/signup',
[requireEmail, requirePassword, requirePasswordConfirmation],
handleErrors(signupTemplate),
 async (req, res) => {
	const { email, password } = req.body;

	const user = await usersRepository.create({ email, password });
	req.session.userID = user.id;
	//Our products index page is our main page for our admin users. Therefore, whenever we sign in, sign up, or create a new product, we want to send them to this page. Therefore, we delete our basic res.send() message and redirect them to the products index page
    res.redirect('/admin/products')
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
handleErrors(signinTemplate),
async (req, res) => {
	const { email } = req.body;
	const user = await usersRepository.getOneBy({ email });
	
    req.session.userID = user.id;
    //We do the same thing here as well
    res.redirect('/admin/products')
});

module.exports = router;
