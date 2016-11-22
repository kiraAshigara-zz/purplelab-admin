var BRAINSPA_LAYOUT = {
    menuItemTable: function (tableName) {
        var template = '<li table-name="{0}" title="{0}"><a href="#"><i class="zmdi zmdi-folder-outline"></i> <p>{0}</p></a></li>';

        return $(template.format(tableName));
    }
};