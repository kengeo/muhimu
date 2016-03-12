var mongoose = require('mongoose');
var schema = {
    'companyName': {type: String, required:true},
    'providerId': {type: mongoose.Schema.Types.ObjectId, ref: 'provder', required: true}, //id of a provider
    'companyAddress': {
        'address': {type: String, default: ''},
        'city': {type: String, default: ''},
        'state': {type: String, default: ''},
        'stateCode': {type: String, default: ''},
        'zip': {type: String, default: ''},
    },
    'companyPhones': [{
        'title': {type: String, default: ''},
        'number': {type: String, default: ''}
    }],
    'contacts': [{
        'name': {type: String, required: true},
        'emails': [{type: String}],
        'phones': [{type: String}]
    }],
    'recruiters': [{
        'fullName': {type: String, required: true},
        'emails': [{type: String, required: true}],
        'appCriteria': {
            'regions': [{type: String}],
            'states': [{type: String}],
            'cities': [{type: String}]
        }

    }],
    'hiringCriteria': {
        'licenseType': {type: Number}, 
        'minimunAge': {type: Number},
        'minimunExp': {type: Number},
        'endorsement': [{type: String}],
        'freightType': [{type: String}],
        'driverType': [{type: String}],
        'targetDrivers': [{type: String}]
    },
    'sysInfo': {
        'active': {type: Boolean, default: true},
        'fake': {type: Boolean, default: false}
    }
};

var schema = mongoose.Schema(schema, {collection: 'clients'});
var model = mongoose.model('clients', schema);
module.exports = model;


