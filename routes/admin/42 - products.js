const express = require('express')
//Within our products route page, we now want to include our validation checks. Therefore we require in validationResult from express-validator
const {validationResult} = require('express-validator')
const ProductsRepository = require('../../repositories/products')
const productsNewTemplate = require('../../views/admin/products/new')
//We also require in our requireTitle and requirePrice validators from our validators file
const {requireTitle, requirePrice} = require('./validators')

const router = express.Router()

router.get('/admin/products', (req, res) => {})

router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}))
})

//We create a post route listener for our new products page. We include in our middleware validator checks for requireTitle and requirePrice within our array.
router.post('/admin/products/new', [requireTitle, requirePrice], (req, res) => {
    //Then, we capture the errors with validationResult. For right now, we'll just console.log() them.
    const errors = validationResult(req)
    console.log(errors)

    //Finally, we'll send a simple message to show that the form was submitted.
    res.send('Submitted!')
})

module.exports = router;