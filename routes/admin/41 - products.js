const express = require('express')
const ProductsRepository = require('../../repositories/products')
//Now, we require in our HTML form template for creating a new product.
const productsNewTemplate = require('../../views/admin/products/new')

const router = express.Router()

router.get('/admin/products', (req, res) => {})

router.get('/admin/products/new', (req, res) => {
    //Within our get route handler for new products, we send the new product template. Right now, we pass through an empty object, but eventually we will have validation checkers that will capture potential errors
    res.send(productsNewTemplate({}))
})

module.exports = router;