const fs = require('fs');
const path = require('path');

const newPath = path.join(
    path.dirname(require.main.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {

    constructor() {
        this.products = [];
        this.totalPrice = 0;

    };

    static addProduct(productId, productPrice) {
        // Fetch the previous cart  
        fs.readFile(newPath, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0.0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === productId);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: productId, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = parseFloat((cart.totalPrice + +productPrice).toFixed(2));
            console.log('Updated Product:', updatedProduct);
            console.log('Updated price:', cart.totalPrice);
            fs.writeFile(newPath, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    };

    static getCart(cb) {
        fs.readFile(newPath, (err, fileContent) => {
            if (err) {
                return cb({ products: [], totalPrice: 0 });
            }
            const cart = JSON.parse(fileContent);
            if (!cart.products) {
                cart.products = [];
            }
            if (!cart.totalPrice) {
                cart.totalPrice = 0;
            }

            cb(cart);
        });
    }

    static deleteProduct(productId, productPrice) {
        fs.readFile(newPath, (err, fileContent) => {
            if (err) {
                return;
            }
            const updatedCart = { ...JSON.parse(fileContent) };
            const product = updatedCart.products.find(prod => prod.id === productId);
            if (!product) {
                return;
            }
            const productQty = product.qty;
            
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== productId);
            updatedCart.totalPrice = parseFloat((updatedCart.totalPrice - productPrice * productQty).toFixed(2));
            fs.writeFile(newPath, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    };
};