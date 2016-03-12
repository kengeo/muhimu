var mongoose = require('mongoose');
var schema = {
    _id : mongoose.Schema.Types.ObjectId,
    'name': {type: String}, // full name of City
    'countyName': {type: String}, 
    'stateName': {type: String}, // full name of state
    'stateCode': {type: String}, // abbreviation of state
    'latitude': {type: Number}, 
    'longitude': {type: Number}, 
    'url': {type: String}, // site url for this specific city
    'domain': {type: String, default: ''},
    'enabledForBot': {type: Boolean, default: false} //if true then domain is not empty
};
var schema = new mongoose.Schema(schema, {collection: 'cities'});
var model = mongoose.model('city', schema);
module.exports = model;

