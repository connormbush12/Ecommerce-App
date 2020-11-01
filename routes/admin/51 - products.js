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

//Now that we have our post route handler's basic set-up, ew can build it out.
//We are going to want to use several of the Middlewares we used earlier
router.post('/admin/products/:id/edit',
requireAuth,
//First, we will want to use upload.single('image') in case we change the image
upload.single('image'),
//We use requireTitle and requirePrice. Since we already have information in there, this always needs to be run regardless (if we don't change anything, it will redo these checks on the existing title and price)
[requireTitle, requirePrice],
//We also need to do handleErrors. This won't work yet because productsEditTemplate requires us to pass through the product information. Therefore, we'll get an error with this for now. We will revisit it in a second
handleErrors(productsEditTemplate), 
async (req, res) => {
    //We want to use our ProductsRepository.update() function that we have defined. To use that, we need to capture all of the changes we made. These can be taken from the req.body
    const changes = req.body

    //Since we don't store images the same way we store the title and price, we need to check if we uploaded a new image. If we did, it will be on req.file, so we can use an if statement to check if that exists.
    if(req.file) {
        //If it does, then we add on the image property of changes and make it equal to req.file.buffer.toString('base64') as we did before
        changes.image = req.file.buffer.toString('base64')
    }
    //Our ProductsRepository.update() function has a catch for an error in case the record (in this case, the product) doesn't return from the ID search. To allow for this, we wrap our use of .update in a try block, catch the error if it occurs, and send a simple message that we couldn't find the product. We will handle this error in a more robust way in the future 
    try {
        //We use ProductRepository.update and pass through our product ID (which is that req.params.id value) and our changes
        //This is asynchronous, so we add async above and await it
        await ProductsRepository.update(req.params.id, changes)
    } catch (err) {
        return res.send('Could not find product.')
    }
    //Finally, if our update works, it should redirect us to our admin products page
    res.redirect('/admin/products')
})

module.exports = router;