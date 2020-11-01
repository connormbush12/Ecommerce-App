const express = require('express')
const multer = require('multer')

const ProductsRepository = require('../../repositories/products')
const productsNewTemplate = require('../../views/admin/products/new')
const productsIndexTemplate = require('../../views/admin/products/index')
const {requireTitle, requirePrice} = require('./validators')
const {handleErrors} = require('./middlewares')

const router = express.Router()
const upload = multer({storage : multer.memoryStorage()})

//To show all of our products, we want to use our .get for /admin/products
router.get('/admin/products', async (req, res) => {
    //First, we get all of our products. We use our ProductsRepository and then use .getAll() to return all of our products in an array. We need to use await here, so we have to make this async above as well
    const products = await ProductsRepository.getAll();
    //Then, we use our newly created productsIndexTemplate, pass through our products inside of an object, and then send that to show on our browswer
    res.send(productsIndexTemplate({products}))
})

router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}))
})

router.post('/admin/products/new',
upload.single('image'),
[requireTitle, requirePrice],
handleErrors(productsNewTemplate),
async (req, res) => {
    const image = req.file.buffer.toString('base64');
    const {title, price} = req.body
    await ProductsRepository.create({title, price, image})

    res.send('Submitted!')
})

module.exports = router;