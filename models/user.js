'use strict';

/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;

/**
 * User Schema
 */
const UserSchema = new Schema({
    name: {type: String, default: ''},
    email: {type: String, default: ''},
    username: {type: String, default: ''},
    hashed_password: {type: String, default: ''},
    salt: {type: String, default: ''},
    authToken: {type: String, default: ''}
});

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

/**
 * Validations
 */
UserSchema.path('email').validate(function (email) {
    return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate(function (email, fn) {
    const User = mongoose.model('User');

    // Check only when it is a new user or when email field is modified
    if (this.isNew || this.isModified('email')) {
        User.find({ email: email }).exec(function (err, users) {
            fn(!err && users.length === 0);
        });
    } else fn(true);
}, 'Email already exists');

UserSchema.path('hashed_password').validate(function (hashed_password) {
    return hashed_password.length && this._password.length;
}, 'Password cannot be blank');


const validatePresenceOf = value => value && value.length;

/**
 * Pre-save hook
 */
UserSchema.pre('save', function (next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password)) {
        next(new Error('Invalid password'));
    } else {
        next();
    }
});

/**
 * Methods
 */
UserSchema.methods = {

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    }
};

/**
 * Statics
 */
UserSchema.statics = {

    /**
     * Load
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */
    load: function (options, cb) {
        options.select = options.select || 'name username';
        return this.findOne(options.criteria)
            .select(options.select)
            .exec(cb);
    }
};

mongoose.model('User', UserSchema);