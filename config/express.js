'use strict';

/**
 * Module dependencies
 */
const express = require('express');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const db = require('../mongoose');

const mongoStore = require('connect-mongo')(session);

/**
 * Expose
 * @param app
 * @param passport
 */
module.exports = function(app, passport) {

    // Static files middleware
    app.use(express.static(path.join(__dirname, '..', 'public')));

    // View engine setup
    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view engine', 'jade');

    app.use(logger('dev'));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(cookieParser());
    app.use(cookieSession({ secret: 'secret' }));
    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: 'google-maps-generator',
        store: new mongoStore({
            url: 'mongodb://localhost/google-maps-generator',
            collection : 'sessions'
        })
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // connect flash for flash messages
    app.use(flash());

    // Make our db accessible to our router
    app.use(function(req,res,next){
        req.db = db;
        next();
    });
};