/**
 * Created with IntelliJ IDEA.
 * User: saf
 */

var mongoose = require('mongoose');
var objectId = mongoose.Schema.ObjectId;
var schema = {
    _id : objectId
    ,'user_id': {type: String}
    ,'client_id': {type: String} //
//    ,'scope': [String]
    ,'token': {type: String, unique:true} //


};
var schema = new mongoose.Schema(schema );
var model = mongoose.model('AccessToken', schema);
module.exports = model;


