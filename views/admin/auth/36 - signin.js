const layout = require('../layout')

//Now, as opposed to defining the getError function here, we require it in from our helpers file
const {getError} = require('../../helpers')


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
