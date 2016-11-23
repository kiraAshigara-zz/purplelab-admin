var BRAINSPA = (function () {

    function initialize() {
        registerEvents();
        loadTables();
    }

    function registerEvents() {
        $('body').on('click', '[table-name]', function () {
            var tableName = $(this).attr('table-name');

            $('.table-name').text(tableName);
        });
    }

    function loadTables() {
        BRAINSPA_SERVICE.getAllTables(function (tables) {
            $.each(tables, function (i, table) {
                $('.list-tables').append(BRAINSPA_LAYOUT.menuItemTable(table));
            });
        });
    }

    return {
        initialize: initialize
    }

})();

$(document).ready(function () {
    BRAINSPA.initialize();
});