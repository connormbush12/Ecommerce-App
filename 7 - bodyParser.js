const express = require('express');

//While our body parsing logic works for the basic requests, there are a lot of corner cases where it would cause errors. Therefore, it's preferred to use an external library for this that has all of those bugs figured out already
const bodyParser = require('body-parser');
const app = express();

//One annoying thing with Middleware functions would be having to retype this below code over and over. Instead, we can use app.use() to automatically pass through this bodyParser Middleware function every time we have any listener (.get, .post, etc.)
//This bodyParser external library already has code to distinguish when it's called for .get versus .post, so we don't have to worry about that
//For bodyParser, we use .urlencoded, which means it only parses url-encoded bodies and only supports UTC-8 encoding of the body
//The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true).
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send(`
	<div>
		<form method="POST">
			<input name="email" placeholder="email"/>
			<input name="password" placeholder="password"/>
			<input name="passwordConfirmation" placeholder="password confirmation"/>
			<button>Sign Up</button>
		</form>
	</div
	`);
});

//We delete our bodyParsing code here and our inclusion of it as a Middleware function as well, since app.use() does this for us automatically
app.post('/', (req, res) => {
	console.log(req.body);
	res.send('Account Created!!!');
});

app.listen(3000, () => {
	console.log('Listening');
});
