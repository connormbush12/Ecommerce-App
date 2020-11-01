const express = require('express');
const carts = require('../repositories/carts');

const router = express.Router();
const cartsRepo = require('../repositories/carts')

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
    //To find out if the item we chose is in our cart or not, we use .find() array callback method on the items array in our cart. .find() tests a boolean expression. For the first item it finds where the boolean is true, it returns that item of the array.
    //Therefore, we search to see if the item's ID matches the product ID from our form request via req.body.productID.
    const existingItem = cart.items.find((item) => item.id === req.body.productID);
    //If .find() finds an item whose ID matches the item we pressed "add to cart", then it will have a value and this if statement will be true
    if(existingItem) {
        //If the item does exist, then we simply go to the item (which is an object with an ID key and a quantity key), access the quantity key, and add one to it
        existingItem.quantity++;
    //If the product doesn't exist, then we need to add it to our cart.
    } else {
        //To add it to our cart, we access the items array and push in an object for that item. The item object should have an id attribute, which we make equal to our req.body.productID, and then we set an initial quantity of 1
        cart.items.push({id : req.body.productID, quantity:1})
    }
    //Right now, all of these changes to our cart exist on our local cart variable. So for the final step, we have to update our cart's record in our cart repository with these updates. We use the .cartsRepo.update() method we defined for our repositories. It takes two arguments: a) the ID of the item we want to update; and b) the attributes that we want to update. First, we pass through our cart ID. Then, we pass through an object that has the items key with all of the new items (via cart.items).
    //This is asynchronous, so we gotta await it
    await cartsRepo.update(cart.id, {items : cart.items})

    //Finally, we console.log our cart to see if the items are being added correctly
    console.log(cart)
    res.send('Product added!')
})

//Get request to show our shopping cart

//Post request to delete an item from our shopping cart


module.exports = router;