const express = require('express')
const multer = require('multer')

const ProductsRepository = require('../../repositories/products')
const productsNewTemplate = require('../../views/admin/products/new')
const productsIndexTemplate = require('../../views/admin/products/index')
const {requireTitle, requirePrice} = require('./validators')
const {handleErrors, requireAuth} = require('./middlewares')

const router = express.Router()
const upload = multer({storage : multer.memoryStorage()})

router.get('/admin/products', requireAuth, async (req, res) => {
    const products = await ProductsRepository.getAll();
    res.send(productsIndexTemplate({products}))
})

router.get('/admin/products/new', requireAuth, (req, res) => {
    res.send(productsNewTemplate({}))
})

router.post('/admin/products/new',
requireAuth,
upload.single('image'),
[requireTitle, requirePrice],
handleErrors(productsNewTemplate),
async (req, res) => {
    const image = req.file.buffer.toString('base64');
    const {title, price} = req.body
    await ProductsRepository.create({title, price, image})

    res.redirect('/admin/products')
})

//We want to have edit pages for each unique product; however, we cannot create a route handler for every single one. Therefore, we use the notation ':id' within our URL string. Whenever we type in a url that matches that format, it will capture any string typed into that space as the req.params.id.
//The 'Edit' button for each product will automatically sub in the product ID that we want into that spot of the URL
//This page should also only be accessible if we are signed in, so we incldue the requireAuth middleware as well
router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
    //Then, we will get our product using our ProductsRepository.getOne and using the ID from the url
    //This is an asynchrnous function, so need to await it and use async above
    const product = await ProductsRepository.getOne(req.params.id)
    
    //Then, we check if the product exists. If the id in the URL is not a valid ID, it will return no product and the if statement will be triggered to show that the product doesn't exist.
    if(!product) {
        res.send('Product not found')
    }
})

module.exports = router;