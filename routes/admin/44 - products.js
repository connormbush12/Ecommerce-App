const express = require('express')
const {validationResult} = require('express-validator')
const multer = require('multer')

const ProductsRepository = require('../../repositories/products')
const productsNewTemplate = require('../../views/admin/products/new')
const {requireTitle, requirePrice} = require('./validators')

const router = express.Router()
const upload = multer({storage : multer.memoryStorage()})

router.get('/admin/products', (req, res) => {})

router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}))
})

//In order to use our validators properly, we have to switch the order of our middlewares. Previously, all of the information coming into our .post request handler was automatically parsed with the body-parser middleware. However, now that we've installed multer for this file and included it as a middleware, multer now handles our incoming form data, not body-parser. Therefore, we have to have multer parse our information first before we use our validators requireTitle and requirePrice. If we have the validators requireTitle and requirePrice before upload.single('image'), then requireTitle and requirePrice will not see readable data (because it hasn't been parsed) and will auto give us errors even if there were no errors.
router.post('/admin/products/new', upload.single('image'), [requireTitle, requirePrice], async (req, res) => {
    const errors = validationResult(req)

    //Now that we have our middlewares in the right place, we can include our error catching logic that we used before. If we catch any errors, it will show the new product form once again and display the errors we pass through
    if(!errors.isEmpty()) {
        res.send(productsNewTemplate({errors}))
    }
    const image = req.file.buffer.toString('base64');
    const {title, price} = req.body
    await ProductsRepository.create({title, price, image})

    res.send('Submitted!')
})

module.exports = router;