const express = require('express')
const multer = require('multer')

const ProductsRepository = require('../../repositories/products')
const productsNewTemplate = require('../../views/admin/products/new')
const productsIndexTemplate = require('../../views/admin/products/index')
const productsEditTemplate = require('../../views/admin/products/edit')
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

router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
    const product = await ProductsRepository.getOne(req.params.id)
    
    if(!product) {
        res.send('Product not found')
    }
    res.send(productsEditTemplate({product}))
})

router.post('/admin/products/:id/edit',
requireAuth,
upload.single('image'),
[requireTitle, requirePrice],
//In order for our handleErrors function to be able to give information beyond our errors to our template, we have to add an extra callback function to handleErrors. In it, we pass through our req object
handleErrors(productsEditTemplate, async (req) => {
    //Our edit products template requires we pass through our product. Therefore, we get the product information here (have to use async/await again)
    const product = await ProductsRepository.getOne(req.params.id);
    //We then return it inside of an object. Remember, we use objects so that we can destructure it all out of one object easily and add to the arguments functions take easily.
    return {product}
}), 
async (req, res) => {
    const changes = req.body

    if(req.file) {
        changes.image = req.file.buffer.toString('base64')
    }
    try {
        await ProductsRepository.update(req.params.id, changes)
    } catch (err) {
        return res.send('Could not find product.')
    }
    res.redirect('/admin/products')
})

module.exports = router;