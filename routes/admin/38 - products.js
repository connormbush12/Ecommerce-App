//Create the boiler plate for our new products router
//First, we require in Express for Node JS
const express = require('express')

//Then, we create our router as we did before
const router = express.Router()

//Now, we do our route handlers. We will have several, but first, we will focus on two route handlers: one 'get' handler for showing us all of our products, and one 'get' handler for showing us a form to create a new product
router.get('/admin/products', (req, res) => {})

router.get('/admin/products/new', (req, res) => {})

//Finally, we export our router
modulue.exports = router;