/**
 * User: saf
 */
var mongoose = require('mongoose');
var objectId = mongoose.Schema.ObjectId;
//require('./clients');
var bcrypt   = require('bcrypt-nodejs');

var schema = {
	photo: {type: String},
    usertype: {type: String},
    firstname: {type: String },
    lastname: {type: String},
    email: {type: String, unique:true},
    password: {type: String},
    company: {type: String},
    number: {type: String },
	website: {type: String },
	description: {type: String },
	locations: [mongoose.Schema.Types.Mixed],
	industry: [{type: String }], //must take from : http://www.onetcenter.org/taxonomy.html
    yearStarted: {type: Number},
    rate: {type: Number},
    createDate: {type: Date, default: Date.now},
    deleteDate: {type: Date },
    isAdmin: {type: Boolean, default: false},
    resume: mongoose.Schema.Types.Mixed,
	isComplete: {type: Boolean, default: false }
};

var schema = new mongoose.Schema(schema, {collection: 'users'});

schema.virtual('name').get(function () {
    return this.firstname+ " " + this.lastname;
}).set(function (name) {
    name = name.split(" ");
    this.firstname = name[0];
    this.lastname = name[1];
});

/*schema.virtual('password').get(function () {
    return this._password;
}).set(function (password) {
        this._password = password;
        var salt = this.salt = bcrypt.genSaltSync(10);
        this.hash = bcrypt.hashSync(password, salt);
    });

schema.method('checkPassword', function (password, callback) {
    bcrypt.compare(password, this.hash, callback);
});

schema.method('checkPassword', function (password, callback) {
    callback(false, password == this.password);
});*/

// methods ======================
// generating a hash
schema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
schema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

schema.static('authenticate', function (email, password, callback) {
    this.findOne({$or:[{email: email }, {username: email }]}, function(err, user) {
        if (err)
            return callback(err);

        if (!user)
            return callback(null, false);

        // if the user is found but the password is wrong
        if (!user.validPassword(password))
            return callback(null, false/*, req.flash('loginMessage', 'Oops! Wrong password.')*/); // create the loginMessage and save it to session as flashdata

        // all is well, return successful user
        return callback(null, user);

        // checking if password is valid

        /*user.checkPassword(password, function(err, passwordCorrect) {
            if (err)
                return callback(err);

            if (!passwordCorrect)
                return callback(null, false);

            return callback(null, user);
        });*/
    });
});


var model = mongoose.model('user', schema);
module.exports = model;