exports.getNotFound = (req, res, next) => {
    // Manual way
    //res.status(404).sendFile(path.join(__dirname, 'views', 'not-found.html')); //express allow us to send response as result sintax sugar

    //PUG Jade template and use render using view engine Pug
    res.status(404).render('not-found', { pageTitle: 'Page Not Found', path: '/404'});
};