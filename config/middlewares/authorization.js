'use strict';

/**
 * Generic require login routing middleware
 * @param request
 * @param response
 * @param next
 */
exports.requiresLogin = function (request, response, next) {
    if (request.isAuthenticated()) return next();
    if (request.method === 'GET') request.session.returnTo = request.originalUrl;
    response.redirect('/login');
};