const Product = require('../models/product');

const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png';

exports.getAddProduct = (req, res, next) => {
    // manual way
    // res.sendFile(path.join(rootDir, 'views', 'edit-product.html')); //express allow us to send response as result sintax sugar

    //PUG Jade template and use render using view engine Pug
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const imageUrl = req.body.imageUrl || DEFAULT_IMAGE;
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;

    // Manually creating product 
    // const product = new Product(null, imageUrl, title, description, price);
    // product.save()
    // .then(() => {
    //     res.redirect('/');//convenience express method
    // })
    // .catch(err => {
    //     console.log(err);
    // });

    // Using Sequelize create method
    Product.create({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    })
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
    Product.findById(productId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(prodId, updatedImageUrl, updatedTitle, updatedDesc, updatedPrice);
    updatedProduct.save()
    .then(() => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
    //
    res.redirect('/admin/products');
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

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
};