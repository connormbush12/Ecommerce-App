//first, we require in layout
const layout = require('../layout')
module.exports = () => {
    //instead of returning the string directly, we use the layout function and pass through an object with the key name content and our HTML code as its value
	return layout({content: `
<div>
<form method="POST">
    <input name="email" placeholder="email"/>
    <input name="password" placeholder="password"/>
    <button>Sign In</button>
</form>
</div
`});
};
