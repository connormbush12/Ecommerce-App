//External Node JS libraries and middleware
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

//Routers
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products')
const productsRouter = require('./routes/products')
const cartsRouter = require('./routes/carts')


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
app.use(productsRouter);
app.use(adminProductsRouter);
app.use(cartsRouter)

app.listen(3000, () => {
	console.log('Listening');
});
