const db = require('../utils/database');

const cart = require('./cart');

const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png';

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
        
    }

    static fetchAll(cb) {
        return db.execute('SELECT * FROM products');
    }

    static findById(id, cb) {
        
    };

    static deleteById(id) {
        
    };
}