const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
//We add our products router for our new home page. We also change the name of our admin products router to signal which is which
const adminProductsRouter = require('./routes/admin/products')
const productsRouter = require('./routes/products')


const { static } = require('express');
const app = express();

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: [ 'asfjaopifjvnpoifcnehoiruaeoirywe' ]
	})
);

//Finally, we use the router below. Again, we add admin to the previous productsRouter
app.use(authRouter);
app.use(productsRouter);
app.use(adminProductsRouter);

app.listen(3000, () => {
	console.log('Listening');
});
