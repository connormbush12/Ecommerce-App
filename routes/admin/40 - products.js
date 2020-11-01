const express = require('express')
//To use our ProductsRepository, we require it in here.
const ProductsRepository = require('../../repositories/products')

const router = express.Router()

router.get('/admin/products', (req, res) => {})

router.get('/admin/products/new', (req, res) => {})

modulue.exports = router;