const path = require('path');

const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop')

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct); //Add dynamic values in path. router parsing is from top to bottom in file. Be carefull on order of routes

router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.get('/add-to-cart', shopController.getCart);

router.post('/orders', shopController.getCart);
router.get('/checkout', shopController.getCheckout);

module.exports = router;