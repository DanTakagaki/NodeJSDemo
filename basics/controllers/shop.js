const Product = require('../models/product');
const Cart = require('../models/cart');

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
            hasProducts: products.length > 0
        }) // This last one is fot .hbs View
    });
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId, product => {
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
    });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        console.log(products);

        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0 // This last one is fot .hbs View
        });
    });
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            if (cart && cart.products && cart.products.length > 0) {
                for (product of products) {
                    const cartProductData = cart.products.find(
                        prod => prod.id === product.id
                    );
                    if (cartProductData) {
                        cartProducts.push({ productData: product, qty: cartProductData.qty });
                    }
                }
            }
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                products: cartProducts,
                totalPrice: cart.totalPrice,
                path: '/cart'
            });
        });
    });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.addProduct(productId, product.price);
    });
    res.redirect('/cart');
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