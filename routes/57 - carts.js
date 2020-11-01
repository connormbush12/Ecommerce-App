const express = require('express')

const router = express.Router();

//Post request to add an item to the cart
//We use the same path that we defined in our 'Add to Cart' form in our views->products->index.js form
router.post('/cart/products', (req, res) => {
    //Then, we send the req.body.productID to see if our hidden input file worked
    res.send(req.body.productID)
    console.log(req.body.productID)
})

//Get request to show our shopping cart

//Post request to delete an item from our shopping cart


module.exports = router;