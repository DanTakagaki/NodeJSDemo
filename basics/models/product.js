const fs = require('fs');
const path = require('path');

const newPath = path.join(
    path.dirname(require.main.filename),
    'data',
    'products.json'
);

const getProductsFromFile = cb => {
    fs.readFile(newPath, (err, fileContent) => {
        if (err) {
            return cb([]);
        }
        cb(JSON.parse(fileContent));
    });
};

module.exports = class Product {
    constructor(newTitle) {
        this.title = newTitle;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(newPath, JSON.stringify(products), (err) => {
                console.log(err);
            })
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
}