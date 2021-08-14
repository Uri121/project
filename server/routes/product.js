const express = require("express");
const router = express.Router();
const { createNewProduct, getProducts } = require('../handlers/productHandler');

//create product
router.put('/create', createNewProduct)
//get list of all products
router.get('/', getProducts)


module.exports = router;