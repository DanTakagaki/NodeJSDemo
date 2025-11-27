// Manuall way to connect and querie db mysql

// const db = require('../utils/database');

// const cart = require('./cart');

// const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png';

// module.exports = class Product {
//     constructor(id, image, title, description, price) {
//         const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png';
//         this.id = id;
//         this.image = image || DEFAULT_IMAGE;
//         this.title = title || 'Untitled Product';
//         this.description = description || 'No description available';
//         this.price = price || '0.00';
//     }

//     save() {
//         //to avoid SQL injection attacks, use ? as placeholder for values
//         return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
//             [this.title, this.price, this.image, this.description]);
//     }

//     static fetchAll() {
//         return db.execute('SELECT * FROM products');
//     }

//     static findById(id) {
//         return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
//     };

//     static deleteById(id) {

//     };
// }



// Sequelize way to connect and querie db mysql

const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

module.exports = Product;