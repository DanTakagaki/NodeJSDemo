const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

require('dotenv').config();
const mysql = require('mysql2');

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const authRoutes = require('../basics-mongodb/routes/auth.js');

const formatPrice = require('./utils/formatters.js');

const app = express();
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
});

const errorController = require('./controllers/error.js')

// Default mongodb without ODM Mongoose
// const mongoConnect = require('./utils/database.js').mongoConnect;
const User = require('./models/user.js');

// template engine ejs
app.set('view engine', 'ejs');
//--

app.set('views', 'basics-mongodb/views');

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
app.use(session({ secret: process.env.SESSION_HASH, resave: false, saveUninitialized: false, store: store}));

//Adding filters in express to add paths
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.getNotFound);

// Manual way
// mongoConnect(() => {
//     app.listen(3000);
// });

// Mongoose way
mongoose
    .connect(process.env.MONGODB_URI)
    .then(result => {
        return User.findOne({ email: 'taka@mail.com' });
    })
    .then(user => {
        if (!user) {
            const user = new User({
                name: "Taka",
                email: "taka@mail.com",
                cart: {
                    items: []
                }
            });
            user.save();
        }
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })