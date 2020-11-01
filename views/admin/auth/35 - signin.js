const layout = require('../layout')

//For this error, we do the exact same thing. We get the same getError function we used from signup.js
const getError = (errors, property) => {
	try {
		return errors.mapped()[property].msg
	} catch (err) {
		return ''
	}
}

//Now, we pass through and destructure errors out of our object and then use getError after each data field
module.exports = ({errors}) => {
	return layout({content: `
<div>
<form method="POST">
    <input name="email" placeholder="email"/>
    ${getError(errors, 'email')}
    <input name="password" placeholder="password"/>
    ${getError(errors, 'password')}
    <button>Sign In</button>
</form>
</div
`});
};
