var mongoose = require('mongoose');
require('./client.js');
require('./provider.js');

var schema = {
    mainInfo: {
        'clientId': {type: mongoose.Schema.Types.ObjectId, ref: 'client', required: true}, //id of a client, will be used in URL
        'providerId': {type: mongoose.Schema.Types.ObjectId, ref: 'provder', required: true}, //id of a provider
        'title': {type: String, required: true},
        'description': {type: String, required: true},
        'jobType': {type: String, required: true}, /* didn't understand what this means ????????*/
        'driverType': [{type: String}], 
        'city': {type: String},
        'state': {type: String},
        'stateCode': {type: String},
        'regional': {type: String},
        'national': {type: Boolean, default: false}, //true in case when jobPost includes whole U.S.
        'companyWebsite': {type: String, default: ''},
        'createDate': {type: Date, default: Date.now},
        'postDate': {type: Date, default: Date.now}, //default:new Date(). may be used for publishing the job later. 
        'expDate': {
            type: Date,
            default: function() {
                return Date.now() + 1000 * 60 * 60 * 24 * 30
            }} //post date + 30 days
    },
    hiringCriteria: {
        'licenseType': {type: Number}, 
        'minimunAge': {type: Number},
        'minimunExp': {type: Number},
        'endorsement': [{type: String}],
        'freightType': [{type: String}],
        'targetDrivers': [{type: String}]
    },
    //optional information
    'additionalInfo': {
        'incentives': [{type: String}], // Description of bonus and commission compensation aspects of the job
        'salary': {type: Number},
        'currency': {type: String}, //default:USD. We will need a list of codes http://en.wikipedia.org/wiki/ISO_4217
        'benefits': [{type: String}],
        'education': [{type: String}], // required education
        'experience': [{type: String}], // required experience
        'employmentType': [{type: String}], //Full-time, Part-Time, Contract, Seasonal
        'clientName': {type: String}, //system. name of client
        'industry': {type: String}, //system. Transportation, Logistics, Trucking
        'location': {type: String},
        'occupationalCategory': [{//example 53-3021.00 (code) Bus Drivers, Transit and Intercity (title)
                'code': {type: String}, //must take from : http://www.onetcenter.org/taxonomy.html
                'title': {type: String}
            }],
        'qualifications': [{type: String}],
        'responsibilities': [{type: String}],
        'skills': [{type: String}],
        'workHours': [{type: String}], // we will need to generate a string in client
        'specialCommitments': {type: Boolean} // true if targeting veterans.
    },
    'statistics': {
        'impressions': {type: Number}, // the number of times a post has been in a list on someone's screen
        'views': {type: Number}, // the number of times someone has clicked into the post and seen it's content
        'conversions': {type: Number} // the number of times someone has clicked the "apply" button/link
    },
    'sysInfo': {
        'active': {type:Boolean,default:true},
        'fake': {type: Boolean, default: false}
    }
          
};
var schema = mongoose.Schema(schema, {collection: 'jobPosts'});

/* Generates value for property: companyWebsite. */
schema.pre('save', function (next) {
    var jobPost = this;

    var cityName = jobPost.mainInfo.city;
    var cityNameForUrl = cityName.replace(/ /, '').toLowerCase();
    var stateCode = jobPost.mainInfo.stateCode;

    var domain = 'truckdrivingjobsin' + cityNameForUrl + stateCode.toLowerCase() + '.com';
    jobPost.mainInfo.companyWebsite = domain;

    next();
});

var model = mongoose.model('jobPost', schema);
module.exports = model;


/*
//sample dictionary document
    {
    type: 'employmentTypes',
    items: [{
            name: 'Full-tile' 
        }, {
            name: 'Part-Time' 
        }, {
            name: 'contract' 
        }, {
            name: 'Seasonal' 
        }]
    }
*/

