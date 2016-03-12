var mongoose = require('mongoose');
var schema = {
    'title': {type: String, required: true},
    'pd': {type: String, required: true}, //Provider’s Primary Domain
    'aip': [{type: String}], //Allowed IP’s
    'ppEmail': {type: String}, //Provider Primary Email address
    'psEmail': {type: String}, //Provider Secondary Email address
    'template': {type: String}, //Application Mailout Template Editor (Rich text Wysiwyg that parses {{placeholders}})
    'sysInfo': {
        'active': {type: Boolean, default: true}
    }
};
var schema = mongoose.Schema(schema, {collection: 'providers'});
var model = mongoose.model('provider', schema);
module.exports = model;


