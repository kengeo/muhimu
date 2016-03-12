var mongoose = require('mongoose');
var schema = {
    _id : mongoose.Schema.Types.ObjectId,
    'region': {type: String},
    'name': {type: String}, // full name of State
    'code': {type: String}, // abbreviation of state
    'url': {type: String} // site url for this specific state
};
var schema = new mongoose.Schema(schema, {collection: 'states'});
var model = mongoose.model('state', schema);
module.exports = model;

/*
{
"northeast" : [{"name":"State Name", "code":"SN", "url":"truckdriverjobsinstatename.com"} ] 
}
*/
