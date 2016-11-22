var mysql = require('mysql');

var getConnection = function () {
    var connection = mysql.createConnection({
        host: '104.196.180.164',
        user: 'root',
        password: 'racerx09!',
        database: 'brainspa'
    });
    return connection;
};

module.exports.getConnection = getConnection;
