//do a modulue.exports for a function
module.exports = () => {
	//simply return the HTML code from auth.js for signing in
	return `
<div>
<form method="POST">
    <input name="email" placeholder="email"/>
    <input name="password" placeholder="password"/>
    <button>Sign In</button>
</form>
</div
`;
};
