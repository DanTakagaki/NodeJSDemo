const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');

const express = require('express');

require('dotenv').config();
const mysql = require('mysql2');
const sequelize = require('./utils/database.js');
const Product = require('./models/product.js');
const User = require('./models/user.js');
const Cart = require('./models/cart.js');
const CartItem = require('./models/cart-item.js');

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

const formatPrice = require('./utils/formatters.js');

const app = express();

const errorController = require('./controllers/error.js')

// template engine ejs
app.set('view engine', 'ejs');
//--

app.set('views', 'basics-sql/views');

app.use((req, res, next) => {
    res.locals.formatPrice = formatPrice;
    next();
});

app.use('/', (req, res, next) => {
    console.log('Allways runs top to bottom');
    next();//Allow the request to continue to next middleware in line
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Fetch user for each request
app.use((req, res, next) => {
    User.findOne({ where: { email: 'taka@test.com' } })
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

//Adding filters in express to add paths
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getNotFound);

// Define relations between models
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// Syncing database and starting server
sequelize.sync() //sync models to database. force = true only on dev to override relations is needed
    .then(result => {
        // Hardcoding user creation for testing purposes
        return User.findOne({ where: { email: 'taka@test.com' } });
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Dan', email: 'taka@test.com' });
        }
        return user;
    })
    .then(user => {
        return user.createCart()
    })
    .then(cart => {
        app.listen(3000); // express sinstax sugar
    })
    .catch(err => {
        console.log(err);
    });


