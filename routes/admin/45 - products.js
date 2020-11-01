const express = require('express')
const multer = require('multer')
//Since we pulled out our error handling and our validation checks to separate files, we no longer need to require in express-validator here

const ProductsRepository = require('../../repositories/products')
const productsNewTemplate = require('../../views/admin/products/new')
const {requireTitle, requirePrice} = require('./validators')
//To use our error handler, we require in our middlewares file and destructure out handleErrors
const {handleErrors} = require('./middlewares')

const router = express.Router()
const upload = multer({storage : multer.memoryStorage()})

router.get('/admin/products', (req, res) => {})

router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}))
})

router.post('/admin/products/new',
upload.single('image'),
[requireTitle, requirePrice],
//handleErrors needs to occur after our parsing and our validation checks have been completed. We pass through the productsnewTemplate itself (without the ()). If we typed in productsnewTemplate(), we would be passing through the result of that function executing, which is not what we want. We want the function itself, which is then used in the way we want within our middleware
handleErrors(productsNewTemplate),
async (req, res) => {
    //Here, we can delete our previous error handling code.
    const image = req.file.buffer.toString('base64');
    const {title, price} = req.body
    await ProductsRepository.create({title, price, image})

    res.send('Submitted!')
})

module.exports = router;