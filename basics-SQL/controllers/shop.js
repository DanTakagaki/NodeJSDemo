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
            let totalPrice = 0;
            products.forEach(element => {
                const price = parseFloat(element.price.toString().replace('$', ''));
                const quantity = element.cartItem.quantity;
                totalPrice += price * quantity;
            });
            console.log('Total Price:', totalPrice);
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
    let fetchedCart;
    let newQuantity = 1;
    req.user
        .getCart()
        .then(cart => {
            console.log('2. Cart found:', cart ? cart.id : 'NO CART');
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            console.log('3. Products in cart:', products.length);
            let product;
            if (products.length > 0) {
                product = products[0];
                console.log('4. Product already in cart, quantity:', product.cartItem.quantity);
            }

            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                console.log('5. Updating quantity to:', newQuantity);
                return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
            }

            console.log('6. Adding new product to cart');
            return Product.findByPk(productId)
                .then(product => {
                    console.log('7. Product found:', product ? product.title : 'NOT FOUND');
                    return fetchedCart.addProduct(product, {
                        through: { quantity: newQuantity }
                    });
                })
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log('✗ ERROR:', err);
            console.log(err)
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    // Manual SQL way
    // Product.findById(productId, product => {
    //     if (!product) {
    //         return res.redirect('/cart');
    //     }
    //     Cart.deleteProduct(productId, product.price);
    //     res.redirect('/cart');
    // });

    // Sequelize way
    const productId = req.body.productId;
    req.user
    .getCart()
    .then(cart => {
        return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
        const product = products[0];
        return product.cartItem.destroy();
    })
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