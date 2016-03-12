/**
 * Created with IntelliJ IDEA.
 * User: saf
 */

var mongoose = require('mongoose');
var objectId = mongoose.Schema.ObjectId;
var schema = {
    _id : objectId
    ,'client_id': {type: String}
    ,'user_id': {type: String} //
    ,'redirect_uri': {type: String} // ??why here? this must be goes into client
    ,'code': {type: String, unique:true} //
    ,'scope': [String]

};
var schema = new mongoose.Schema(schema );
var model = mongoose.model('AuthorizationCode', schema);
module.exports = model;


