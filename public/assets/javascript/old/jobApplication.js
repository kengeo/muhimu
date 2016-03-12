var mongoose = require('mongoose');
var schema = {
    'personalInfo': {
        'firstName': {type: String}, // Are special characters allowed? 
        'lastName': {type: String},
        'address': {type: String},
        'city': {type: String},
        'state': {type: String},
        'zip': {type: String},
        'dob': {type: Date}, //date of birth
        'ssn': {type: String}, //social security number
        'email': {type: String},
        'phone': {type: String},
        'bttc': {type: String} //best time to call
    },
    'drivingInformation': {
        'dsg': {type: Boolean}, //Driver School Graduate
        'iana': {type: String}, //I Am Now A: possible values:Owner Operator, Company Driver, Student
        'truckCount': {type: Number}, // Owner Operators How Many Trucks
        'endorsements': {type: String}, //possible values: Hazmat, Tanker, Double/Triple
        'experiencedDriving': [{type: String}], //possible values: "Experienced Driving"
        'iWillRun': [{type: String}], //possible values: "I Will Run"
        'iWillPull': [{type: String}], //possible values: "I Will Pull"
        'runAs': [{type: String}], //possible values: "Run As"
        'drivingExp': {//Years Driving Experience
            'from': {type: Number}, //number of months. ex: 3 years will be 36
            'to': {type: Number} //number of months
        },
        'leasePurchase': {type: Boolean}, //Are you interested in a lease/purchase program?
    },
    'drivingLicense': {
        'licenseNumber': {type: String},
        'stateOfIssue': {type: String},
        'expirationDate': {type: Date},
        'class': {type: String} //possible values A,B,C
    },
    'violationInformation': {
        'violations': {type: Number},
        'accidents': {type: Number}
    },
    'presentEmployer': {
        'reasonForLeaving': {type: String},
        'startDate': {type: Date},
        'name': {type: String},
        'phone': {type: String},
        'address': {type: String},
        'state': {type: String},
        'zip': {type: String}
    },
    'previousEmployers': [{//now the number is 3 but an array is good for this in any case
            'reasonForLeaving': {type: String},
            'startDate': {type: Date},
            'endDate': {type: Date},
            'name': {type: String},
            'phone': {type: String},
            'address': {type: String},
            'state': {type: String},
            'zip': {type: String}
        }],
    'criminalRecordInformation': {
        'felony': {type: Date},
        'drunk': {type: Date},
        'deniedLicense': {type: Date},
        'suspendLicense': {type: Date},
        'carelessOperation': {type: Date},
        'drugs': {type: Date},
        'deniedInsurence': {type: Date},
        'discharged': {type: Date}
    },
    'comment': {type: String},
    'sysInfo': {
        'active': {type: Boolean, default: true}
    },
    'jobPostId': {type: mongoose.Schema.Types.ObjectId, ref: 'jobPost' },
    'clientId': {type: mongoose.Schema.Types.ObjectId, ref: 'client' },
    'createDate': {type: Date, default: Date.now},
};
var schema = mongoose.Schema(schema, {collection: 'jobApplications'});
var model = mongoose.model('jobApplication', schema);
module.exports = model;


