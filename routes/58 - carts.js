const express = require('express')

const router = express.Router();
//We require in our carts repository so we can use the methods below
const cartsRepo = require('../repositories/carts')

//Post request to add an item to the cart
router.post('/cart/products', async (req, res) => {
    //Figure out if a cart already exists or we have to create a new one
    //We define cart as a let variable so that we can access it within and outside of our if statements (lexical scope) and so that we can change its value
    let cart;
    //To find our cart, we see if the cartID attribute has been added to our req.session cookie yet
    if(!req.session.cartID) {
        //If it has not, then we need to create a new cart. To do this, we use our cartsRepo.create() function
        //For this function, we pass through an object. In it, we define a key for items (that we add to our cart) and set it as an empty array
        //We have to use async / await here since this is asynchronous
        //The cartsRepo.create() function automatically gives our cart an ID
        cart = await cartsRepo.create({items : []})
        //Then, we assign the req.session.cartID value to our cart's ID
        req.session.cartID = cart.id;
        //If the above if statement is false (req.session.cartID does exist) then we already have a cart for this user
    } else {
        //Therefore, we assign the cart variable to their cart from the carts repository. We use cartsRepo.getOne() and the cart's ID from req.session.cartID to identify our cart within our carts repository
        cart = await cartsRepo.getOne(req.session.cartID);
    }
    //Finally, we console.log() our cart to see if it works. The first time we use it, it should create a cart with an ID. To see if it works, then, the second time you use it, it should give back the same cart with the same ID as opposed to creating a new one
    console.log(cart)
    res.send('Product added!')
})

//Get request to show our shopping cart

//Post request to delete an item from our shopping cart


module.exports = router;