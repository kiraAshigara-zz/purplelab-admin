var BRAINSPA_LAYOUT = {
    menuItemTable: function (tableName) {
        var template = '<li table-name="{0}" title="{0}"><a href="#"><i class="zmdi zmdi-folder-outline"></i> <p>{0}</p></a></li>';

        return $(template.format(tableName));
    },
    dataTable: function (fieldsInfo) {
        var template = '<table class="table table-striped table-bordered table-data">' +
            '<thead>' +
            '<tr>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '</tbody>' +
            '</table>';

        var tableDOM = $(template);
        var fields = {};

        $.each(fieldsInfo.fields, function (i, field) {
            tableDOM.find('tr').append($('<th>{0}</th>'.format(field.field)));
            fields[field.field] = field;
        });

        tableDOM.find('tr').append($('<th class="tabledit-toolbar-column"></th>'));

        tableDOM.data('table-info', fields);

        return tableDOM;
    },
    dataTableRow: function (row) {
        var tableInfo = $('.table-data').data('table-info');
        var primaryKey = $('.table-data').attr('primary-key');
        var trDOM = $('<tr id="{0}"></tr>'.format(row[primaryKey]));
        var tdTemplate = '<td class="tabledit-view-mode"><span class="tabledit-span" style="display: inline;">{1}</span><input class="tabledit-input form-control input-sm" type="{2}" name="{0}" value="{1}" style="display: none;" disabled=""></td>';
        var noEditableTdTemplate = '<td><span class="tabledit-span tabledit-identifier">{1}</span><input class="tabledit-input tabledit-identifier" type="hidden" name="{0}" value="{1}" disabled=""></td>';
        var buttonsTemplate = '<td style="white-space: nowrap; width: 1%;"><div class="tabledit-toolbar btn-toolbar" style="text-align: left;">' +
            '<div class="btn-group btn-group-sm" style="float: none;"><button type="button" class="tabledit-edit-button btn btn-sm btn-default" style="float: none;"><span class="glyphicon glyphicon-pencil"></span></button><button type="button" class="tabledit-delete-button btn btn-sm btn-default" style="float: none;"><span class="glyphicon glyphicon-trash"></span></button></div>' +
            '<button type="button" class="tabledit-save-button btn btn-sm btn-success" style="float: none; display: none;">Save</button>' +
            '<button type="button" class="tabledit-confirm-button btn btn-sm btn-danger" style="display: none; float: none;">Confirm</button>' +
            '<button type="button" class="tabledit-restore-button btn btn-sm btn-warning" style="display: none; float: none;">Restore</button>' +
            '</div></td>';
        var tdDOM;

        var type;

        $.each(row, function (field, value) {

            type = tableInfo[field].type.contains('varchar') ? 'text' : 'number';

            if (field === primaryKey) {
                tdDOM = $(noEditableTdTemplate.format(field, value, type));
            } else {
                tdDOM = $(tdTemplate.format(field, value, type));
            }

            tdDOM.attr('field', field);
            trDOM.append(tdDOM);
        });

        trDOM.append(buttonsTemplate);

        return trDOM;
    }
};