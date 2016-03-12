var mongoose = require('mongoose');
/*require('./client.js');
require('./provider.js');*/

var schema = {
    title: {type: String},
    description: {type: String},
    category: {type: String},
    status: {type: String, default: 'Draft'},
    reward: {type: String},
    visibility: {type: Boolean},
    relocation: {type: Boolean},
    remote: {type: Boolean},
    files: [{
	    filename: {type: String},
	    type: {type: String},
	    location: {type: String},
	    fileurl: {type: String}
    }],
    opportunity: {type: String},
    moredetails: {type: String},
    level: {type: String},
    type: {type: String},
    location: mongoose.Schema.Types.Mixed,
    applications: [mongoose.Schema.Types.Mixed],
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    createDate: {type: Date, default: Date.now},
    expDate: {
            type: Date,
            default: function() { return Date.now() + 1000 * 60 * 60 * 24 * 60 }
    },
    statistics: {
        impressions: {type: Number}, // the number of times a post has been in a list on someone's screen
        views: {type: Number}, // the number of times someone has clicked into the post and seen it's content
        conversions: {type: Number} // the number of times someone has clicked the "apply" button/link
    },
    sysInfo: {
        active: {type:Boolean,default:true},
        fake: {type: Boolean, default: false}
    }

};
var schema = mongoose.Schema(schema, {collection: 'opportunities'});

var model = mongoose.model('opportunity', schema);
module.exports = model;
