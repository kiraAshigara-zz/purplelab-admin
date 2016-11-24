var BRAINSPA = (function () {

    var lockTablesLoad = false;
    var timer;

    function initialize() {
        registerEvents();
        loadTables();
    }

    function registerEvents() {
        $('body').on('click', '[table-name]', function () {
            if (lockTablesLoad) {
                return;
            }

            lockTablesLoad = true;

            var tableName = $(this).attr('table-name');

            $('.table-name').text(tableName);
            $('.table-data-container').hide();
            $('.loading-tables').css('display', 'inherit');


            BRAINSPA_SERVICE.getFieldsInfoByTableName(tableName, function (fieldsInfo) {
                createDataTable(fieldsInfo);

                BRAINSPA_SERVICE.getDataByTableName(tableName, loadData, fail);

                lockTablesLoad = false;
            }, fail);
        });

        $('.add-new-row').click(function () {
            $('.table-fields input').val('');
            $('.modal-new-row').modal('show');
        });

        $('.save-new-row').click(function () {
            var newRow = {
                fields: []
            };

            var inputList = $('.table-fields input');

            $.each(inputList, function (i, input) {
                newRow.fields.push({
                    fieldName: $(input).attr('field'),
                    fieldValue: $(input).val()
                });
            });

            addNewRow(newRow);
        });

        $('.search-tables').on('keyup', function () {
            var term = $(this).val().trim();

            window.clearTimeout(timer);
            timer = window.setTimeout(function () {
                var listTables = $('li[table-name]');

                if (term.length > 0) {
                    var tableName;
                    $.each(listTables, function (i, table) {
                        tableName = $(table).attr('table-name');

                        if (tableName.contains(term)) {
                            $(table).show();
                        } else {
                            $(table).hide();
                        }
                    });
                } else {
                    listTables.show();
                }

            }, 300);
        });
    }

    function loadTables() {
        BRAINSPA_SERVICE.getAllTables(function (tables) {
            $.each(tables, function (i, table) {
                $('.list-tables').append(BRAINSPA_LAYOUT.menuItemTable(table));
            });
        }, fail);
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
                swal("Row Updated!", '', "success");
            }, fail);

            Edit.customReset(rowDOM);
        };

        Delete.submit = function (rowDOM) {
            var tableName = $('.table-name').text();
            var primaryKey = $('.table-data').attr('primary-key');
            var primaryKeyValue = $(rowDOM[0]).parent().find('[field={0}] > span'.format(primaryKey)).text();

            BRAINSPA_SERVICE.deleteRowByTableName(tableName, primaryKeyValue, function () {
                $(rowDOM[0]).parent().remove();
                swal("Row Deleted!", '', "success");
            }, fail);
        };

        initializeModal();
    }

    function loadData(data) {
        $('.loading-tables').hide();
        $('.table-data-container').show();

        $.each(data, function (i, row) {
            $('.table-data').find('tbody').append(BRAINSPA_LAYOUT.dataTableRow(row));
        });

        $('.add-new-row').show();
    }

    function initializeModal() {
        var fieldsInfo = $('.table-data').data('table-info');
        var templateField = '<tr><td>{0}</td><td><input type="{1}"/></td></tr>';
        var trDOM;
        $('.table-fields tbody').empty();

        $.each(fieldsInfo, function (field, value) {
            trDOM = $(templateField.format(field, (value.type.contains('varchar') ? 'text' : 'number')));

            $.each(value, function (attr, attrValue) {
                if (attr !== 'type') {
                    trDOM.find('input').attr(attr, attrValue);
                } else {
                    trDOM.find('input').attr('type2', attrValue);
                }
            });

            $('.table-fields tbody').append(trDOM);
        });
    }

    function addNewRow(newRow) {
        var tableName = $('.table-name').text();

        BRAINSPA_SERVICE.addRowByTableName(tableName, newRow, function () {
            var row = {};

            $.each(newRow.fields, function (i, field) {
                row[field.fieldName] = field.fieldValue;
            });

            $('.table-data').find('tbody').prepend(BRAINSPA_LAYOUT.dataTableRow(row));
            $('.modal-new-row').modal('hide');
            swal("Row Created!", '', "success");
        }, fail);
    }

    function fail(error) {
        var message = '';

        if (error.responseJSON && error.responseJSON.error) {
            message = error.responseJSON.error;
        }

        swal("Error!", message, "error");
        lockTablesLoad = false;
    }

    return {
        initialize: initialize
    }

})();

$(document).ready(function () {
    BRAINSPA.initialize();
});