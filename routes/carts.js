const express = require('express');

const router = express.Router();
const cartsRepo = require('../repositories/carts')
const productsRepo = require('../repositories/products')
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
    //First, we want to make sure a cart exists
    if(!req.session.cartID) {
        return res.redirect('/')
    }
    const cart = await cartsRepo.getOne(req.session.cartID);
    for (item of cart.items) {
        const product = await productsRepo.getOne(item.id);
        item.product = product;
    }

    res.send(showCartTemplate({items : cart.items}))

})

//Post request to delete an item from our shopping cart


module.exports = router;