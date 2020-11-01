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
handleErrors(productsEditTemplate, async (req) => {
    const product = await ProductsRepository.getOne(req.params.id);
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

//To delete items, we use another post route handler similar to what we used for editing products. It captures the id in the URL and we use /delete as the route. We also require authentication as we have before.
router.post('/admin/products/:id/delete', requireAuth, async (req, res) => {
    //We simply use our .delete() method from our ProductsRepository and delete it using the id from the URL
    await ProductsRepository.delete(req.params.id)
    //Then, we send them to our products page again
    res.redirect('/admin/products')
})

module.exports = router;