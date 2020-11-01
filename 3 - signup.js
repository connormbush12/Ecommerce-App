const express = require('express');
const app = express();
app.get('/', (req, res) => {
	//Within the .send() method, we supply HTML for a form that includes inputs for email, password, and password confirmation and a button to submit the info
	//So when we access that route of '/', the .get() function recognizes it and sends the response which is the HTML form
	res.send(`
	<div>
		<form>
			<input placeholder="email"/>
			<input placeholder="password"/>
			<input placeholder="password confirmation"/>
			<button>Sign Up</button>
		</form>
	</div
	`);
});

app.listen(3000, () => {
	console.log('Listening');
});
