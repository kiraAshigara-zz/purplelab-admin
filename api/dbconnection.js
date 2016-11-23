var mysql = require('mysql');
var util = require('util');


var getConnection = function () {
    var connection = mysql.createConnection({
        host: '104.196.180.164',
        user: 'root',
        password: 'racerx09!',
        database: 'brainspa',
        multipleStatements: true
    });
    return connection;
};

var getPrimaryKeyFromTable = function(connection, tableName, done){
    var query = util.format('show index from %s where Key_name = \'PRIMARY\'', tableName);
    connection.query(query, function (err, rows, fields) {
        if (err) throw Error("error getting index info");
        done(rows[0]);
    });
};

module.exports.getConnection = getConnection;
module.exports.getPrimaryKeyFromTable = getPrimaryKeyFromTable;
