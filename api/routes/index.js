var express = require('express');
var security = require('../security/basic_auth');
var dbconnection = require('../dbconnection');
var router = express.Router();


router.get('/', security.auth, function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/list-tables', security.auth, function (req, res, next) {
    var connection = dbconnection.getConnection();
    connection.query('show tables like \'%LUP%\';', function (err, rows, fields) {
        if (err) throw err;
        var tableNames = [];
        for (var i in rows) {
            val = rows[i]['Tables_in_brainspa (%LUP%)'];
            tableNames.push(val);
        }
        res.json(tableNames);
    });
    connection.end();
});

module.exports = router;
