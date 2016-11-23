var BRAINSPA_SERVICE = (function () {

    var username = 'root';
    var password = 'test01';
    var API_URL = 'http://localhost:3001';
    var GET_ALL_TABLES = '{0}/list-tables'.format(API_URL);

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

    return {
        getAllTables: getAllTables
    }

})();