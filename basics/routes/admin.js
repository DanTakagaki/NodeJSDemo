const path = require('path');

const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/edit-product', adminController.getAddProduct);
router.post('/edit-product', adminController.postAddProduct);
router.get('/products', adminController.getProducts);

module.exports = router;
