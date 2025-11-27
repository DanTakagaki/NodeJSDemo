const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');

const express = require('express');

require('dotenv').config();
const mysql = require('mysql2');

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

const formatPrice = require('./utils/formatters.js');

const app = express();

const errorController = require('./controllers/error.js')

const mongoConnect = require('./utils/database.js').mongoConnect;

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

// Fetch user for each request
app.use((req, res, next) => {
    // User.findOne({ where: { email: 'taka@test.com' } })
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch(err => console.log(err));

    next();
});

//Adding filters in express to add paths
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getNotFound);

mongoConnect(() => {
    app.listen(3000);
});