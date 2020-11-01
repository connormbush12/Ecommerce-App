const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

//First thing we do is cut all of our route handlers (.get() and .post() listeners) into our auth.js file
//Then, we can delete the require() for usersRepository since we don't use it in here anymore

//Next, we create our authRouter by requiring in our auth file. Within the auth.js file, we module.export our router for use here
const authRouter = require('./routes/admin/auth');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: [ 'asfjaopifjvnpoifcnehoiruaeoirywe' ]
	})
);
//Then, AFTER all of our app.use() for Middleware functions, we do app.use(authRouter)
app.use(authRouter);

app.listen(3000, () => {
	console.log('Listening');
});
