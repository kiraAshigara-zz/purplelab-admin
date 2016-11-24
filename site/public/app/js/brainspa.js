var BRAINSPA = (function () {

    function initialize() {
        registerEvents();
        loadTables();
    }

    function registerEvents() {
        $('body').on('click', '[table-name]', function () {
            var tableName = $(this).attr('table-name');

            $('.table-name').text(tableName);
            BRAINSPA_SERVICE.getFieldsInfoByTableName(tableName, function (fieldsInfo) {
                createDataTable(fieldsInfo);

                BRAINSPA_SERVICE.getDataByTableName(tableName, loadData);
            });
        });
    }

    function loadTables() {
        BRAINSPA_SERVICE.getAllTables(function (tables) {
            $.each(tables, function (i, table) {
                $('.list-tables').append(BRAINSPA_LAYOUT.menuItemTable(table));
            });
        });
    }

    function createDataTable(fieldsInfo) {
        $('.table-data').remove();
        $('.table-data-container').append(BRAINSPA_LAYOUT.dataTable(fieldsInfo));

        var identifier = [];
        var editable = [];

        $.each(fieldsInfo.fields, function (i, field) {
            if (field.key === 'PRI') {
                identifier.push(i);
                identifier.push(field.field);
                $('.table-data').attr('primary-key', field.field);
            } else {
                editable.push([i, field.field]);
            }
        });

        $('.table-data').Tabledit({
            columns: {
                identifier: identifier,
                editable: editable
            }
        });

        Edit.submit = function (rowDOM) {
            var tableName = $('.table-name').text();
            var primaryKey = $('.table-data').attr('primary-key');
            var row = {
                "primaryKeyValue": $(rowDOM[0]).parent().find('[field={0}] > span'.format(primaryKey)).text(),
                "fields": []
            };

            $.each(rowDOM, function (i, td) {
                row.fields.push({
                    "fieldName": $(td).attr('field'),
                    "fieldValue": $(td).find('input').val()
                });
            });

            BRAINSPA_SERVICE.updateRowByTableName(tableName, row, function (message) {
                console.log(message);
            }, function (error) {
                console.log(error);
            });

            Edit.customReset(rowDOM);
        };
    }

    function loadData(data) {
        $.each(data, function (i, row) {
            $('.table-data').find('tbody').append(BRAINSPA_LAYOUT.dataTableRow(row));
        });
    }

    return {
        initialize: initialize
    }

})();

$(document).ready(function () {
    BRAINSPA.initialize();
});