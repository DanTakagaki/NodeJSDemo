const fs = require('fs');
const path = require('path');

const cart = require('./cart');

const newPath = path.join(
    path.dirname(require.main.filename),
    'data',
    'products.json'
);

const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png';

const getProductsFromFile = cb => {
    fs.readFile(newPath, (err, fileContent) => {
        if (err) {
            return cb([]);
        }

        // Parse and normalize products
        const products = JSON.parse(fileContent);
        const normalized = products.map(p => ({
            id: p.id,
            image: p.image || DEFAULT_IMAGE,
            title: p.title || '',
            description: p.description || '',
            price: p.price || 0.00
        }));

        cb(normalized);
    });
};

module.exports = class Product {
    constructor(id, image, title, description, price) {
        const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png';
        this.id = id;
        this.image = image || DEFAULT_IMAGE;
        this.title = title || 'Untitled Product';
        this.description = description || 'No description available';
        this.price = price || '0.00';
    }

    save() {
        getProductsFromFile(products => {

            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(newPath, JSON.stringify(updatedProducts), (err) => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(newPath, JSON.stringify(products), (err) => {
                    console.log(err);
                })
            }
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(iterator => iterator.id === id);
            cb(product);
        });
    };

    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(newPath, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    cart.deleteProduct(id, product.price);
                } else {
                    console.log(err);
                }
            });
        });
    };
}