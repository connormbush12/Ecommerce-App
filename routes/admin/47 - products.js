const express = require('express')
const multer = require('multer')

const ProductsRepository = require('../../repositories/products')
const productsNewTemplate = require('../../views/admin/products/new')
const productsIndexTemplate = require('../../views/admin/products/index')
const {requireTitle, requirePrice} = require('./validators')
const {handleErrors} = require('./middlewares')

const router = express.Router()
const upload = multer({storage : multer.memoryStorage()})

router.get('/admin/products', async (req, res) => {
    const products = await ProductsRepository.getAll();
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

	//Our products index page is our main page for our admin users. Therefore, whenever we sign in, sign up, or create a new product, we want to send them to this page. Therefore, we delete our basic res.send() message and redirect them to the products index page    
    res.redirect('/admin/products')
})

module.exports = router;