const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');

const express = require('express');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

//template engine dependency
app.set('view engine', 'pug');
app.set('views', 'basics/views');

app.use('/', (req, res, next) => {
    console.log('Allways runs top to bottom');
    next();//Allow the request to continue to next middleware in line
});
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//Adding filters in express to add paths
app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'not-found.html')); //express allow us to send response as result sintax sugar
});

//Express has methods for this
//const routes = require('./routes');

//const server = http.createServer(app);
//server.listen(3000);
app.listen(3000) // express sinstax sugar

