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

    // Using Sequelize create method based on relation with user
    req.user
        .createProduct({
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

    // Manual SQL way
    // Product.findById(productId, product => {
    //     if (!product) {
    //         return res.redirect('/');
    //     }
    //     res.render('admin/edit-product', {
    //         pageTitle: 'Edit Product',
    //         path: '/admin/edit-product',
    //         editing: editMode,
    //         product: product
    //     });
    // });

    // Sequelize way
    req.user
        .getProducts({ where: { id: productId } })
        .then((products) => {
            if (products.length === 0) {
                return res.status(404).render('404', {
                    pageTitle: 'Product Not Found',
                    path: '/products'
                });
            }

            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: products[0]
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postEditProduct = (req, res, next) => {
    // Manual SQL way
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;
    // manual sql way
    // const updatedProduct = new Product(prodId, updatedImageUrl, updatedTitle, updatedDesc, updatedPrice);
    // updatedProduct.save()
    //     .then(() => {
    //         console.log('UPDATED PRODUCT!');
    //         res.redirect('/admin/products');
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
    //

    Product.update(
        {
            title: updatedTitle,
            price: updatedPrice,
            imageUrl: updatedImageUrl,
            description: updatedDesc
        },
        {
            where: {
                id: prodId
            }
        }
    )
        .then(() => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });

};

exports.getProducts = (req, res, next) => {
    // Manual SQL way
    // Product.findAll()
    //     .then(products => {
    //         res.render('admin/products', {
    //             prods: products,
    //             pageTitle: 'Admin Products',
    //             path: '/admin/products'
    //         });
    //     })
    //     .catch(err => console.log(err));

    // Sequelize way
    req.user.getProducts()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
    // Manual SQL way
    // const prodId = req.body.productId;
    // Product.deleteById(prodId);
    // res.redirect('/admin/products');

    // Sequelize way
    const prodId = req.body.productId;
    Product.destroy({
        where: {
            id: prodId
        }
    })
        .then(() => {
            console.log('DELETED PRODUCT');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};