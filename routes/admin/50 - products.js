const express = require('express')
const multer = require('multer')

const ProductsRepository = require('../../repositories/products')
const productsNewTemplate = require('../../views/admin/products/new')
const productsIndexTemplate = require('../../views/admin/products/index')
//We want to send a new template for editing our page, so we need to require it in here
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
    //Now that we have created our edit product template, we send us there with the productsEditTemplate function and pass through our product into the object
    res.send(productsEditTemplate({product}))
})

//Now, we need to create a post request for whenever we submit our edit form. We capture the id once again in the url. For now, let's just send that we 'Posted it!' if it works
router.post('/admin/products/:id/edit', requireAuth, (req, res) => {
    res.send('Posted it!')
})

module.exports = router;