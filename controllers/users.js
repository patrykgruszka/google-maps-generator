'use strict';

/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const User = mongoose.model('User');

/**
 * Get users list
 * @param request
 * @param response
 */
exports.list = function(request, response) {
    User.find({}, function (error, docs) {
        if (error) {
            response.status(500).send({ message: 'There was a problem with getting users from the database:' + error });
        } else {
            response.json(docs);
        }
    });
};

/**
 * Create user
 * @param request
 * @param response
 */
exports.create = function(request, response) {
    const user = new User(request.body);

    user.save(function (error) {
        if (error) {
            const errors = Object.keys(error.errors)
                .map(field => error.errors[field].message);
            request.flash('errors', errors);
            response.redirect('/signup');
        } else {
            request.flash('success', 'User was added successfully to database');
            response.redirect('/login');
        }
    });
};

/**
 * Login
 * @param request
 * @param response
 */
exports.login = function(request, response) {
    response.render('login', {
        title: 'Login - Google Maps Generator',
        errors: request.flash('error'),
        info: request.flash('info'),
        success: request.flash('success')
    });
};

/**
 * Register
 * @param request
 * @param response
 */
exports.signup = function(request, response) {
    response.render('signup', {
        title: 'New user registration - Google Maps Generator',
        errors: request.flash('errors')
    });
};

/**
 * Logout
 * @param request
 * @param response
 */
exports.logout = function(request, response) {
    request.logout();
    response.redirect('/login')
};