var express = require('express');
var util = require('util');
var security = require('../security/basic_auth');
var dbconnection = require('../dbconnection');
var mysql = require('mysql');
var router = express.Router();


router.get('/', security.auth, function (req, res, next) {
    res.render('index', {title: 'Api braninspa'});
});

router.get('/list-tables', security.auth, function (req, res, next) {
    var connection = dbconnection.getConnection();
    var query = 'show tables like \'%LUP%\'';
    connection.query(query, function (err, rows, fields) {
        if (err) return next(err);
        var tableNames = [];
        for (var i in rows) {
            var val = rows[i]['Tables_in_brainspa (%LUP%)'];
            tableNames.push(val);
        }
        res.json(tableNames);
    });
    connection.end();
});


router.get('/list-tables/:tableName', security.auth, function (req, res, next) {
    var connection = dbconnection.getConnection();
    var tableName = req.params["tableName"];
    var query = util.format("DESCRIBE %s", tableName);
    connection.query(query, function (err, rows, fields) {
        if (err) return next(err);
        var result = {
            "table_name": tableName,
            "fields": []
        };
        for (var i in rows) {
            var field = rows[i]['Field'];
            var type = rows[i]['Type'];
            var nullable = rows[i]['Null'];
            var key = rows[i]['Key'];
            result.fields.push({
                "field": field,
                "type": type,
                "nullable": nullable,
                "key": key
            });
        }
        res.json(result);
    });
    connection.end();
});


router.get('/get-data/:tableName', security.auth, function (req, res, next) {
    var connection = dbconnection.getConnection();
    var tableName = req.params["tableName"];

    var query = util.format("select * from %s", tableName);
    connection.query(query, function (err, rows, fields) {
        if (err) return next(err);
        var result = [];
        for (var i in rows) {
            result.push(rows[i]);
        }
        res.json(result);
    });
    connection.end();
});

router.post('/save/:tableName', security.auth, function (req, res, next) {
    var body = req.body;
    var tableName = req.params["tableName"];

    var obj = {};
    for (i in body.fields) {
        var field = body.fields[i];
        obj[field.fieldName] = field.fieldValue;
    }

    var insertQuery = util.format("INSERT INTO %s SET ?", tableName);
    var connection = dbconnection.getConnection();

    connection.query(insertQuery, obj, function (err, result) {
        if (err) return next(err);
        res.json({"affectedRows": result["affectedRows"]});
    });
    connection.end();
});

router.post('/update/:tableName', security.auth, function (req, res, next) {
    var body = req.body;
    var tableName = req.params["tableName"];

    var connection = dbconnection.getConnection();
    dbconnection.getPrimaryKeyFromTable(connection, tableName, function (data) {
        var indexName = data["Column_name"];
        var values = [];
        for (i in body.fields) {
            var field = body.fields[i];
            var obj = {};
            if (field.fieldName === indexName) continue;
            obj[field.fieldName] = field.fieldValue;
            values.push(obj);
        }

        var queries = '';
        values.forEach(function (item) {
            var queryUpdate = util.format("UPDATE %s SET ? where %s = '%s';",
                tableName, indexName, body.primaryKeyValue);
            queries += mysql.format(queryUpdate, item);
        });
        connection.query(queries, function (err, result) {
            if (err) return next(err);
            res.json({"affectedRows": result["affectedRows"]});
        });
        connection.end();
    });
});

router.delete('/delete/:tableName/:pk', security.auth, function (req, res, next) {
    var tableName = req.params["tableName"];
    var pk = req.params["pk"];

    var connection = dbconnection.getConnection();
    dbconnection.getPrimaryKeyFromTable(connection, tableName, function (data) {
        var indexName = data["Column_name"];

        var queryDelete = util.format("delete from %s where %s = '%s'", tableName, indexName, pk);
        connection.query(queryDelete, function (err, result) {
            if (err) return next(err);
            res.json({"affectedRows": result["affectedRows"]});
        });
        connection.end();
    });
});


module.exports = router;
