var mongoose = require('mongoose');
var schema = {
    'title': {type: String, required: true},
    'list': [{
        type:String,
        required:true
    }]
};
var schema = new mongoose.Schema(schema, {collection: 'lists'});
var model = mongoose.model('list', schema);
module.exports = model;