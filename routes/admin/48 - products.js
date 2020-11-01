const express = require('express')
const multer = require('multer')

const ProductsRepository = require('../../repositories/products')
const productsNewTemplate = require('../../views/admin/products/new')
const productsIndexTemplate = require('../../views/admin/products/index')
const {requireTitle, requirePrice} = require('./validators')
//We want to make sure people cannot get to our product creation pages or product admin pages unless they are signed in. Therefore, we created the requireAuth middleware to check for this. We destructure it out from our middlewares file here.
const {handleErrors, requireAuth} = require('./middlewares')

const router = express.Router()
const upload = multer({storage : multer.memoryStorage()})

//We simply put it here (again, we do not execute it, we pass a reference to the function)
router.get('/admin/products', requireAuth, async (req, res) => {
    const products = await ProductsRepository.getAll();
    res.send(productsIndexTemplate({products}))
})

//Do it again here
router.get('/admin/products/new', requireAuth, (req, res) => {
    res.send(productsNewTemplate({}))
})

//We do it again here. We put this middleware first because we want to make sure they are allowed to be on this page before we even start checking what they uploaded and things like that
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

module.exports = router;