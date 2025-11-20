const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // manual way
    // res.sendFile(path.join(rootDir, 'views', 'edit-product.html')); //express allow us to send response as result sintax sugar

    //PUG Jade template and use render using view engine Pug
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/edit-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

exports.postAddProduct = (req, res, next) => {
    const imageUrl = req.body.imageUrl;
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(imageUrl, title, description, price);
    product.save();
    res.redirect('/');//convenience express method
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        console.log(products);
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
};