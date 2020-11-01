//Create a new route page for listing our products
//We need express and to create a router
const express = require('express');

const router = express.Router()
//We will list our products on our home page, so the path is just '/'
router.get('/', async (req, res) => {
    res.send('PRODUCTS!!!')
});

//Export it
module.exports = router;