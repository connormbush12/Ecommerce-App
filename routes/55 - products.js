const express = require('express');
//We require in our products repository to get all of our products
const productsRepository = require('../repositories/products')
//We create our products template in our view folder and then require it in here
const productsIndexTemplate = require('../views/products/index')
const router = express.Router()

router.get('/', async (req, res) => {
    //For our product view, we need all of the products that we've created
    //We get our products via our productsRepository.getAll() function
    const products = await productsRepository.getAll();
    //Then, we send our template with our products passed through in an object
    res.send(productsIndexTemplate({products}))
});

module.exports = router;