const express = require('express');

const router = express.Router();
const cartsRepo = require('../repositories/carts')
//We have to require in productsRepo so that we can find our product info given our product ID
const productsRepo = require('../repositories/products')
//We also require in our showCartTemplate from our new view page to generate the HTML for our cart
const showCartTemplate = require('../views/cart/show')

//Post request to add an item to the cart
router.post('/cart/products', async (req, res) => {
    //Figure out if a cart already exists or we have to create a new one
    let cart;
    console.log(req.session.cartID)
    if(!req.session.cartID) {
        cart = await cartsRepo.create({items : []})
        req.session.cartID = cart.id;
    } else {
        cart = await cartsRepo.getOne(req.session.cartID);
    }
    
    //Figure out if the product is already in our cart (adding to the quantity) or if this is a new product for our cart
    const existingItem = cart.items.find((item) => item.id === req.body.productID);
    if(existingItem) {
        existingItem.quantity++;
    } else {
        cart.items.push({id : req.body.productID, quantity:1})
    }
    await cartsRepo.update(cart.id, {items : cart.items})

    console.log(cart)
    res.send('Product added!')
})

//Get request to show our shopping cart
router.get('/cart', async (req, res) => {
    //First, we want to make sure a cart exists. We do that the same way we do above using our cookie from req.session
    if(!req.session.cartID) {
        //If it does exist, we go on as normal. But if it doesn't exist, we want to send them back to our homepage since they haven't added anything to the cart yet
        return res.redirect('/')
    }
    //Then, we want to get our cart using the cartsRepo.getOne() function. This is async, so need to await it.
    const cart = await cartsRepo.getOne(req.session.cartID);
    //Then, for each item in our cart, we want to get some more of the product details that we can display on our cart HTML page
    //To get this information, we for...of loop over our carts.items
    for (item of cart.items) {
        //We create a product variable using productsRepo.getOne() and the ID of the item in the array
        const product = await productsRepo.getOne(item.id);
        //Finally, we want to be able to access this information on our HTML page to get the title, price, image, etc. To do this simply, we save the product information as a key on our item object. This information is not saved back to our cartsRepo, so this is ok because it's just a temporary placement of info
        item.product = product;
    }
    //Finally, we use res.send to send our cart page HTML. Within showCartTemplate, we pass through an object. In the showCartTemplate view page, we destructure out 'items' from the object. Therefore, we define the key as 'items' and set that equal to cart.items 
    res.send(showCartTemplate({items : cart.items}))

})

//Post request to delete an item from our shopping cart


module.exports = router;