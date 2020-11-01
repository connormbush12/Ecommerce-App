const express = require('express');
const app = express();
app.get('/', (req, res) => {
	//When we make a form, it auto-defaults to using the GET method. When submitting information, such as for a blog post, a comment, or creating an account like we are here, we want to use the POST method. This allows our server to save this information to access later
	//In addition, to be able to access this information, we have to give the input properties the "name" property so we can use that name property to access the information later
	//By going to the Console, clicking 'Network', clicking on the submission object, clicking the 'Headers' button, and then scrolling down to the 'Form Data' section, we can see our form information
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

//Currently, the app is only looking for a GET request at the path '/'. If we change the above to a POST method without any additional code, we will get an error
//Therefore, we got to set up our app to look for the POST method at this same path. To start, we'll send a simple message such as "Account Created!!!" just to show that it works
app.post('/', (req, res) => {
	res.send('Account Created!!!');
});

app.listen(3000, () => {
	console.log('Listening');
});
