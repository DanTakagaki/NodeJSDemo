const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
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
    const productId = req.params.productId;
    Product.findById(productId)
        .then((product) => {
            console.log(product);
            if (!product) {
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
    Product.fetchAll()
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
    console.log(req.user.cart);

    req.user
        .getCart()
        .then(products => {
            let totalPrice = 0;
            products.forEach(element => {
                const price = parseFloat(element.price.toString().replace('$', ''));
                const quantity = element.quantity;
                totalPrice += price * quantity;
            });
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                products: products,
                totalPrice: totalPrice.toFixed(2),
                path: '/cart'
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            return req.user
                .addToCart(product);
        })
        .then(result => {
            console.log('Product added to cart');
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .deleteItemFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProducts(
                        products.map(product => {
                            product.orderItem = { quantity: product.cartItem.quantity };
                            return product;
                        })
                    );
                })
                .catch(err => console.log(err));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err)
            res.redirect('/cart');
        });
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({ include: ['products'] })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};