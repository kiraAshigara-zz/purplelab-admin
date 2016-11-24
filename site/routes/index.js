var express = require('express');
var router = express.Router();
var auth = require('basic-auth');
var security = require('./security/basic_auth');

router.get('/', security.auth, function (req, res, next) {
    res.render('index', {userName: auth(req).name});
});

module.exports = router;
