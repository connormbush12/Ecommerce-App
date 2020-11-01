const express = require('express')
const {validationResult} = require('express-validator')
//In order to access a file we upload (such as an image) we have to change the encoding type associated with our form submission to multipart/form-data. Our standard middleware we've been using for parsing our form data (body-parser) is for urlencoded form info. Therefore, since we have an image upload in this form, we have to install a new middleware to handle these multipart forms.
//To parse our multipart form data, we use multer
const multer = require('multer')

const ProductsRepository = require('../../repositories/products')
const productsNewTemplate = require('../../views/admin/products/new')
const {requireTitle, requirePrice} = require('./validators')

const router = express.Router()
//In order to use multer, we have to create an upload variable that specifies a specific storage place. For now, we use the multer.memoryStorage() option, which stores are uploaded files as buffer inside of our computer's memory
const upload = multer({storage : multer.memoryStorage()})

router.get('/admin/products', (req, res) => {})

router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}))
})

//Then, we have to include the multer middleware in our .post request handler. We use upload.single() which accepts one single file. We specify the field name from our form that we are accepting, which is the 'image' form name.
//We also got to make this async now that we use await with ProductsRepository
router.post('/admin/products/new', [requireTitle, requirePrice], upload.single('image'), async (req, res) => {
    const errors = validationResult(req)
    //For our image, we convert it to Base 64 characters for storage. upload.single() stores are uploaded file on req.file
    const image = req.file.buffer.toString('base64');
    //Then, we destructure out our title and price from our req.body
    const {title, price} = req.body
    //Finally, we use our ProductsRepository.create() method and pass through our attributes for title, price, and image in an object
    await ProductsRepository.create({title, price, image})

    res.send('Submitted!')
})

module.exports = router;