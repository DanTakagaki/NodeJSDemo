const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
    //manual way
    // console.log(adminData.products);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html')); //express allow us to send response as result sintax sugar

    //PUG Jade template and use render using view engine Pug
    res.render('shop', { prods: adminData.products, docTitle: 'Shop'})

});

module.exports = router;