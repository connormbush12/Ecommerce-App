const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
//Require in our new products router from the admin folder
const productsRouter = require('./router/admin/products')
const { static } = require('express');
const app = express();

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: [ 'asfjaopifjvnpoifcnehoiruaeoirywe' ]
	})
);
app.use(authRouter);
//Implement the router here as we did with the authRouter
app.use(productsRouter)

app.listen(3000, () => {
	console.log('Listening');
});
