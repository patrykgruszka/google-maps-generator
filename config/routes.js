'use strict';

/**
 * Module dependencies
 */
const application = require('../controllers/app');
const locations = require('../controllers/locations');
const users = require('../controllers/users');
const auth = require('./middlewares/authorization');

/**
 * Expose routes
 * @param app
 * @param passport
 */
module.exports = function(app, passport) {
    const pauth = passport.authenticate.bind(passport);

    app.get('/', auth.requiresLogin, application.index);
    app.get('/location*', auth.requiresLogin, application.index);

    // authentication
    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.post('/login', pauth('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: 'Invalid email or password.'
    }));
    app.get('/logout', users.logout);

    // locations api
    app.get('/api/locations', locations.list);
    app.get('/api/locations/:locationId', locations.get);
    app.post('/api/locations', locations.create);
    app.put('/api/locations/:locationId', locations.update);
    app.delete('/api/locations/:locationId', locations.delete);

    // users api
    app.get('/api/users', users.list);
    app.post('/api/users', users.create);


    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use(function(err, req, res) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
};