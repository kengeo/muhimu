/**
 * Created with IntelliJ IDEA.
 * User: saf
 * Date: 9/2/13
 * Time: 6:22 PM
 * To change this template use File | Settings | File Templates.
 */

var filters = {}

filters.user_auth = function (req, res, next){
    next();
}

filters.user_role = function(roles){
    return function(req, res, next){
        foreach ()
        next();
    }

}