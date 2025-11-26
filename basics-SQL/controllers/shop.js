const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    // Manual SQL way
    // Product.fetchAll()
    //     .then(([rows, fieldData]) => {
    //         console.log(rows)
    //         res.render('shop/product-list', {
    //             prods: rows,
    //             pageTitle: 'All Products',
    //             path: '/products'
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });

    // Sequelize way
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
    // Manual SQL way
    // const productId = req.params.productId;
    // Product.findById(productId)
    //     .then(([products]) => {
    //         console.log(products);
    //         if (products.length === 0) {
    //             return res.status(404).render('404', {
    //                 pageTitle: 'Product Not Found',
    //                 path: '/products'
    //             });
    //         }

    //         res.render('shop/product-details', {
    //             product: products[0],
    //             pageTitle: products.title,
    //             path: '/products'
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });

    const productId = req.params.productId;
    Product.findByPk(productId)
        .then((product) => {
            console.log(product);
            if (product.length === 0) {
                return res.status(404).render('404', {
                    pageTitle: 'Product Not Found',
                    path: '/products'
                });
            }

            res.render('shop/product-details', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getIndex = (req, res, next) => {
    // Manual SQL way
    // Product.fetchAll()
    //     .then(([rows, fieldData]) => {
    //         console.log(rows)
    //         res.render('shop/index', {
    //             prods: rows,
    //             pageTitle: 'Shop',
    //             path: '/'
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });

    // Sequelize way
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    // Manual SQL way
    // Cart.getCart(cart => {
    //     Product.fetchAll()
    //         .then(([rows, fieldData]) => {
    //             const cartProducts = [];

    //             if (cart && cart.products && cart.products.length > 0) {
    //                 for (product of rows) {
    //                     const cartProductData = cart.products.find(
    //                         prod => prod.id === rows.id
    //                     );
    //                     if (cartProductData) {
    //                         cartProducts.push({ productData: product, qty: cartProductData.qty });
    //                     }
    //                 }
    //             }

    //             res.render('shop/cart', {
    //                 pageTitle: 'Your Cart',
    //                 products: cartProducts,
    //                 totalPrice: cart.totalPrice,
    //                 path: '/cart'
    //             });
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    // });

    // Sequelize way
    console.log(req.user.cart);
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts()
        })
        .then(products => {
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                products: products,
                path: '/cart'
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.addProduct(productId, product.price);
    });
    res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        if (!product) {
            return res.redirect('/cart');
        }
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};