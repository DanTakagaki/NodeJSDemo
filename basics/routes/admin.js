const path = require('path');

const express = require('express');

const router = express.Router();

const productsController = require('../controllers/products');

router.get('/add-product', productsController.getAddProduct);

//get is for  use methods for GET requests. also has  for otheres http methods
router.post('/add-product', productsController.postAddProduct);

module.exports = router;
