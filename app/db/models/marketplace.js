var mongoose = require('mongoose');
var schema = {
    name: {type: String},
    description: {type: String},
    category: {type: String},
    visibility: {type: Boolean},
    files: [{
	    type: {type: String},
	    location: {type: String}
    }],
    price: {type: Number},
    comments: [{
    	location: {type: String},
    	user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    	date: {type: Date},
    	body: {type: String},
    	reply: [{
	    	user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
	    	date: {type: Date},
	    	body: {type: String}
	    }]
    }],
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    createDate: {type: Date, default: Date.now}
};
var schema = mongoose.Schema(schema, {collection: 'marketplace'});
var model = mongoose.model('marketplace_item', schema);
module.exports = model;


