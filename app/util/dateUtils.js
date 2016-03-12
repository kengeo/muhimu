/**
 * Returns '01' instead of 1 in order to output 2013-08-24 instead of 2013-8-24
 */
var lpadDate = function (datePart) {
    if ((datePart+'').length === 1) {
        return '0' + datePart;
    }

    return datePart+'';
};

var formatDate = function (date) {
    date = new Date(date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var str = year + '-' + lpadDate(month) + '-' + lpadDate(day);
    return str;
};

var truncDate = function (date) {
    date = new Date(date);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
}


module.exports.formatDate = formatDate;
module.exports.truncDate = truncDate;
