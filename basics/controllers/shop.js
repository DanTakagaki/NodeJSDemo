const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        // manual way
        // console.log(products);
        // res.sendFile(path.join(rootDir, 'views', 'shop.html')); //express allow us to send response as result sintax sugar

        // PUG Jade template and use render using view engine Pug
        // res.render('shop', { prods: products, pageTitle: 'Shop', path: '/'})

        // express-handlers template template engine using view engine express-handlers
        // does not run logic just variables
        console.log(products);

        res.render('shop/product-list', { 
            prods: products, 
            pageTitle: 'All Products', 
            path: '/products', 
            hasProducts: products.length > 0 }) // This last one is fot .hbs View
    });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        console.log(products);

        res.render('shop/index', { 
            prods: products, 
            pageTitle: 'Shop', 
            path: '/', 
            hasProducts: products.length > 0 }) // This last one is fot .hbs View
    });
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart', { 
        pageTitle: 'Your Cart',
        path: '/cart'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', { 
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};