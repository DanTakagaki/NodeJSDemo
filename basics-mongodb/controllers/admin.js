const product = require('../models/product');
const Product = require('../models/product');

const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png';

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postAddProduct = (req, res, next) => {
    const imageUrl = req.body.imageUrl || DEFAULT_IMAGE;
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    // Default way
    // const userId = req.user._id;
    // const product = new Product(title, price, description, imageUrl, null, userId);
    // product.save()
    //     .then(result => {
    //         console.log(result);
    //         res.redirect('/admin/products');
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });

    // Mongoose way ODM
    const product = new Product({ title: title, price: price, description: description, imageUrl: imageUrl, userId: req.user });
    product
        .save()
        .then(result => {
            console.log(result);
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).render('404', {
                    pageTitle: 'Product Not Found',
                    path: '/products'
                });
            }

            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;

    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle
            product.price = updatedPrice
            product.imageUrl = updatedImageUrl
            product.description = updatedDesc
            return product.save();//mongoose method
        })
        .then(() => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });

};

exports.getProducts = (req, res, next) => {
    Product.find()
        //.select('title price imageUrl') //Filter out properties
        // .populate('userId', 'name') //add data from mapped object
        .then(products => {
            console.log(products)
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndDelete(prodId)//Mongoose method
        .then(() => {
            console.log('DELETED PRODUCT');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};