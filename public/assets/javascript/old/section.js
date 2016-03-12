var mongoose = require('mongoose');
var schema = {
    _id : mongoose.Schema.Types.ObjectId,
    'title': {type: String}, //
    'description': {type: String}, //
    'thumb': [{type: String}], //
    'link': {type: String}, //
    'image': {type: String}, //
    'sysInfo': {
        'active': {type: Boolean, default: true}
    }
};
var schema = new mongoose.Schema(schema, {collection: 'sections'});
var model = mongoose.model('section', schema);
module.exports = model;


