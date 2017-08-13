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

    user.save(function (error, result) {
        if (error) {
            response.status(500).send({ message: error });
        } else {
            response.json({
                message: 'User was added successfully to database',
                result: result
            });
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
        error: request.flash('error')
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