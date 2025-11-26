const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');

const express = require('express');

require('dotenv').config();
const mysql = require('mysql2');
const sequelize = require('./utils/database.js');

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
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//Adding filters in express to add paths
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getNotFound);
sequelize.sync() //sync models to database
.then(result => {
    console.log(result);
    app.listen(3000) // express sinstax sugar
})
.catch(err => {
    console.log(err);
});


