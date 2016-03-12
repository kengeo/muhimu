/**
 * Created with IntelliJ IDEA.
 * User: saf
 * Date: 9/5/13
 * Time: 3:20 PM
 * To change this template use File | Settings | File Templates.
 */
var crypto = require('crypto');


module.exports.random_key = function(){
//  var  c = crypto.createHash('md5').update(Math.random().toString()).digest('hex');
    var c = crypto.createHash('md5').update(crypto.randomBytes(10)).digest('hex');
    return c;
}

exports.uid = function(len) {
    var buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
};

/**
 * Retrun a random int, used by `utils.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
