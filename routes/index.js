const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Node maps',
        controller: 'index'
    });
});

router.get('/location*', function(req, res, next) {
    res.render('index', {
        title: 'Node maps',
        controller: 'index'
    });
});

module.exports = router;
