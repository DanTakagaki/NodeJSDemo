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

//template engine dependency with express-handlebars
// const { engine } = require('express-handlebars');

// app.engine('hbs', engine({
//     extname: 'hbs',
//     defaultLayout: false
// }));
// app.set('view engine', 'hbs');
//--

//template engine dependency with PUG (Jade)
// app.set('view engine', 'pug');
//--

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

//Express has methods for this
//const routes = require('./routes');

//const server = http.createServer(app);
//server.listen(3000);
app.listen(3000) // express sinstax sugar

