var mongoose = require('mongoose');
/*require('./client.js');
require('./provider.js');*/

var schema = {
    "name": {type: String}

};

var schema = mongoose.Schema(schema, {collection: 'degreetypes'});

// Duplicate the ID field.
schema.virtual('id').get(function(){
    return this._id.toHexString();
});

schema.virtual('text').get(function(){
    return this.name;
});

// Ensure virtual fields are serialised.
schema.set('toJSON', {
    virtuals: true
});

var model = mongoose.model('degreetype', schema);
module.exports = model;
