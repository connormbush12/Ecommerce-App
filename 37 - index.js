const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const { static } = require('express');
const app = express();

//In order to use CSS files in Node JS and with Express, we use a middleware for static files
//Static files are files such as images, CSS files, scripts, etc. that are not server-generated but must be sent to the browser when requested. These files do not rely on any code from the server - their content does not change dynamically
//To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express
//We put all of our static files into a public folder. Then, we use express.static to direct any static requests to the public folder
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: [ 'asfjaopifjvnpoifcnehoiruaeoirywe' ]
	})
);
app.use(authRouter);

app.listen(3000, () => {
	console.log('Listening');
});
