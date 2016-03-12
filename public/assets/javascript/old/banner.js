var mongoose = require('mongoose');
var objectId = mongoose.Schema.ObjectId;
var schema = {
    _id : objectId,
    'title': {type: String},
    'description': {type: String}, //
    'thumb': [{type: String}], //
    'link': {type: String}, //
    'image': {type: String}, //
    'sysInfo': {
        'active': {type: Boolean, default: true}
    }
};
var schema = new mongoose.Schema(schema, {collection: 'banners'});
var model = mongoose.model('banner', schema);
module.exports = model;


