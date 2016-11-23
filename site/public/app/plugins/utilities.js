String.prototype.format = function () {
    var formatted = this, i, size = arguments.length;
    for (i = 0; i < size; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};