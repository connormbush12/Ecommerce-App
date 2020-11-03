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
    //Another small thing we do here is redirect us to the cart whenever we add an item as opposed to sending a message
    res.redirect('/cart')
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
//We create a post request to handle the post form submission that occurs whenever we select the delete button for an item.
router.post('/cart/products/delete', async (req, res) => {
    //First, we destructure out the itemID from the req.body. This itemID is there because we added it as a hidden value on our form submission
    const {itemID} = req.body;
    //We use the req.session.cartID to get our full cart info
    const cart = await cartsRepo.getOne(req.session.cartID);
    
    //Then, we use the array callback method .filter() to filter out the item we deleted. As a reminder, .filter() requires a boolean to be returned. If the boolean is true, then .filter() will push that element of the array into a new array. If false, it won't. Therefore, we make the boolean to be that the item's ID is NOT equal to the itemID from our form submission. Therefore, every item that isn't the one we were trying to delete will be true and be pushed into this new items array.
    const items = await cart.items.filter(item => item.id !== itemID)
    //Now that the items array has all of the items except for the item we tried to delete, we use the cartsRepo.update() to update the cart without the deleted item.
    await cartsRepo.update(req.session.cartID, {items})

    //Finally, we want to redirect us back to the cart page
    res.redirect('/cart')
})

module.exports = router;