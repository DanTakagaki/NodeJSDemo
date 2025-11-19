const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // manual way
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html')); //express allow us to send response as result sintax sugar

    //PUG Jade template and use render using view engine Pug
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');//convenience express method
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        // manual way
        // console.log(products);
        // res.sendFile(path.join(rootDir, 'views', 'shop.html')); //express allow us to send response as result sintax sugar

        // PUG Jade template and use render using view engine Pug
        // res.render('shop', { prods: products, pageTitle: 'Shop', path: '/'})

        // express-handlers template template engine using view engine express-handlers
        // does not run logic just variables
        res.render('shop', { 
            prods: products, 
            pageTitle: 'Shop', 
            path: '/', 
            hasProducts: products.length > 0 })
    });
};