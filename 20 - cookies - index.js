const express = require('express');
const bodyParser = require('body-parser');

//First, we have to require in the external library cookie-session
//Before doing this, we need to install it via our terminal. Go to our terminal and type in 'npm install cookie-session'
const cookieSession = require('cookie-session');
const usersRepository = require('./repositories/users');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//cookie-session is a Middleware function, similar to bodyParser. Therefore, we incorporate it to always be used via app.use. cookie-session has one argument, which is an options object. It only has one property: 'keys', whose value is an array with only one item: a random string. This keys property uses this random string to encrypt all of the information inside of our cookie. If a user tried to access their cookie, they would have to know this random string in order to decipher the information instide the cookie. Without it, none of the info is useful. If we created some accounts using this key, and then came in here and changed the encryption key, then we would never be able to access those earlier created accounts again
app.use(
	cookieSession({
		keys: [ 'asfjaopifjvnpoifcnehoiruaeoirywe' ]
	})
);

//To check to see if we got the user ID that we needed, we will show it in our form. That means, if the server already has set up a cookie for this browser, then the ID will show up whenever they go on the page. See below why this is on the req object
app.get('/', (req, res) => {
	res.send(`
	<div>
	Your ID is: ${req.session.userID}
		<form method="POST">
			<input name="email" placeholder="email"/>
			<input name="password" placeholder="password"/>
			<input name="passwordConfirmation" placeholder="password confirmation"/>
			<button>Sign Up</button>
		</form>
	</div
	`);
});

app.post('/', async (req, res) => {
	const { email, password, passwordConfirmation } = req.body;
	const existingUser = await usersRepository.getOneBy({ email });
	if (existingUser) {
		return res.send('Email already in use');
	}
	if (password !== passwordConfirmation) {
		return res.send('Passwords do not match');
	}
	//First, we want to create a user whenever we submit the form. So if it passes those two above checks, then we use usersRepository.create() with the email and password we passed into the req.body. To do this, we have to go into users.js and return attributes, so we get all of the information needed
	const user = await usersRepository.create({ email, password });
	//The cookie-session external library adds in one property to the req object - a "session" property that can be accessed via req.session. req.session is an empty object. We can add any properties we want on it. Whenever we use req.send, cookie-session will look at our object, see any information we added, encode all of that info into a simple string, and then attach it on the outgoing response as the cookie that should be stored on the user's browser
	//Therefore, we will create a userID property for our req.session object and then store the automatically generated ID that we create with usersRepository.create(). That way, each user's cookie contains their random userID
	req.session.userID = user.id;
	//Now when we send this, the cookie should be attached to the outgoing message for the browser to store. To check this, refresh the localhost:3000 page and see if the userID pops up in our form message we added earlier
	res.send('Account Created!!!');
});

app.listen(3000, () => {
	console.log('Listening');
});
