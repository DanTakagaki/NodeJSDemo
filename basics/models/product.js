const fs = require('fs');
const path = require('path');

const newPath = path.join(
    path.dirname(require.main.filename),
    'data',
    'products.json'
);

const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png';

const formatPrice = (price) => {
    if (!price || price === '' || price === null || price === undefined) {
       return 'Out of Stock';
    }
    // Remove any existing $ and spaces, then add $
    const cleanPrice = String(price).replace(/[$\s]/g, '');
    return `$${cleanPrice}`;
}

const getProductsFromFile = cb => {
    fs.readFile(newPath, (err, fileContent) => {
        if (err) {
            return cb([]);
        }
        
        // Parse and normalize products
        const products = JSON.parse(fileContent);
        const normalized = products.map(p => ({
            image: p.image || DEFAULT_IMAGE,
            title: p.title || '',
            description: p.description || '',
            price: formatPrice(p.price)
        }));
        
        cb(normalized);
    });
};

module.exports = class Product {
    constructor(image, title, description, price) {
        const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png';
        
        this.image = image || DEFAULT_IMAGE;
        this.title = title || 'Untitled Product';
        this.description = description || 'No description available';
        this.price = price || '0.00';
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