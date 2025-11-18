const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html')); //express allow us to send response as result sintax sugar
});

//get is for  use methods for GET requests. also has  for otheres http methods
router.post('/add-product', (req, res, next) => {
    products.push({ title: req.body.title });
    console.log(req.body);
    res.redirect('/');//convenience express method
});

exports.routes = router;
exports.products = products;