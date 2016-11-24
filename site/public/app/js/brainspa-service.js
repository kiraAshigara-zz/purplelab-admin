var BRAINSPA_SERVICE = (function () {

    var username = 'root';
    var password = 'test01';
    var API_URL = 'http://' + window.location.host.replace('3000', '3001');
    var GET_ALL_TABLES = API_URL + '/list-tables';
    var GET_TABLE_FIELDS_INFO = API_URL + '/list-tables/{0}';
    var GET_TABLE_DATA = API_URL + '/get-data/{0}';
    var UPDATE_ROW = API_URL + '/update/{0}';

    function beforeSend(xhr) {
        xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
    }

    function getAllTables(done) {
        $.ajax({
            url: GET_ALL_TABLES,
            dataType: 'json',
            beforeSend: beforeSend
        }).done(done);
    }

    function getFieldsInfoByTableName(tableName, done) {
        $.ajax({
            url: GET_TABLE_FIELDS_INFO.format(tableName),
            dataType: 'json',
            beforeSend: beforeSend
        }).done(done);
    }

    function getDataByTableName(tableName, done) {
        $.ajax({
            url: GET_TABLE_DATA.format(tableName),
            dataType: 'json',
            beforeSend: beforeSend
        }).done(done);
    }

    function updateRowByTableName(tableName, row, done, fail) {
        $.ajax({
            type: 'POST',
            url: UPDATE_ROW.format(tableName),
            data: JSON.stringify(row),
            contentType: 'application/json',
            dataType: 'json',
            beforeSend: beforeSend
        }).done(done).fail(fail);
    }

    return {
        getAllTables: getAllTables,
        getFieldsInfoByTableName: getFieldsInfoByTableName,
        getDataByTableName: getDataByTableName,
        updateRowByTableName: updateRowByTableName
    }

})();