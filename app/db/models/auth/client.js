/**
 * User: saf
 */


var mongoose = require('mongoose');
var objectId = mongoose.Schema.ObjectId;
require('./user.js')
var schema = {
//    _id : objectId // this is client_id
    'name': {type: String}
//    ,'client_id': {type: String, unique:true} //
    ,'client_secret': String
    ,'callback_uri': String
    ,'_creator': {type: objectId, ref:'user'}
};

var schema = new mongoose.Schema(schema );
var model = mongoose.model('client', schema);
module.exports = model;
