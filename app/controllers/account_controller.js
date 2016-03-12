var locomotive = require('locomotive')
    , Controller = locomotive.Controller;
var passport = require('passport');
var mongoose = require('mongoose');
var con_login = require('connect-ensure-login');
var options = require('../files/options.json');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
    fs   = require('fs-extra'),
    changecase = require('change-case');

/*var transport = nodemailer.createTransport(smtpTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    auth: {
        user: 'user',
        pass: 'pass'
    }
}));*/

var transport = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');


var AccountController = new Controller();

AccountController.signup = function() { //signup form
    this.render();
}

AccountController.individual = function() { //signup form
    //console.log(this.settings.env);
    this.render();
}

AccountController.company = function() { //signup form
    this.render();
}

AccountController.recruiter = function() { //signup form
    this.render();
}

AccountController.create = function() { //register or signup
    var user = mongoose.model('user');
    var account = new user();
    var self = this;
    var incorrect_password = false;
    var individual = self.models['user'];

    account.email = this.param('email');
    account.firstname = this.param('firstname');
    account.lastname = this.param('lastname');
    account.usertype = this.param('usertype');

    if (this.param('company')) {
	    account.company = this.param('company');
    }

	if (account.usertype === "Individual") {
	    var form = "individual";
    } else {
	    var form = "company";
    }

    if (this.param('password') === this.param('confirmpassword')) {
	    account.password = account.generateHash(this.param('password'));
    } else {
	    incorrect_password = true;
	    self.user = account;

		return self.render(form, {message:"Passwords do not match."});
    };

	if (!incorrect_password) {
	    account.save(function (err, person) {
	        if (err) {

	            return self.render(form, {message: err});
			} else {
				var mailOptions = {
			        from: 'muhimu <hello@muhimu.net>',
				    to: account.email,
				    subject: 'Welcome to muhimu',
				    text: 'Welcome to muhimu.'
			    }
				transport.sendMail(mailOptions, function(error, response){
			        if(error){
			            console.log(error);
			        } else {
			            console.log("Message sent: " + response);
			        }
			        transport.close(); // shut down the connection pool, no more messages
			    });
		        //return self.redirect(self.urlFor({ action: 'login' }));


		        passport.authenticate('local')(self.__req, self.__res, function () {
		            self.__res.redirect('/dashboard');
		        });
		        /*passport.authenticate('local', {
		            successReturnToOrRedirect: '/dashboard',
		            failureRedirect: self.redirect(self.urlFor({ action: 'login' })) }
				)(self.__req, self.__res, self.__next);*/
			}
	    });
    }
}

AccountController.login = function() {
    //this.user = this.req.user;
    passport.authenticate('local', {
        successReturnToOrRedirect: '/dashboard',
        failureRedirect: this.urlFor({ action: 'login' })
    })(this.__req, this.__res, this.__next);
}

AccountController.loginForm = function() {
    //this.user = this.req.user;
    this.render();
}

AccountController.settings = function() {
	this.user = this.req.user;
    //this.options = options;
    this.changecase = changecase;
    //console.log(this.options);
    this.render();
}

AccountController.password = function() {
	this.user = this.req.user;
    //this.options = options;
    this.changecase = changecase;
    //console.log(this.options);
    this.render();
}

AccountController.resume = function() {
	var user = this.req.user;
	this.user = this.req.user;
    //this.options = options;
    this.changecase = changecase;
    //console.log(this.options);
    this.render();
}

AccountController.update = function() {
    var user = this.req.user;
    this.user = this.req.user;
    var account = {};
    var self = this;

    //console.log(self);

	if (self.__req.files.photo){
		// Temporary location of our uploaded file
	    var temp_path = self.__req.files.photo.path;
	    //The file name of the uploaded file
	    var file_name = self.__req.files.photo.name;
	   //Location where we want to copy the uploaded file
	    var new_location = 'public/uploads/';

	    fs.copy(temp_path, new_location + file_name, function(err) {
	        if (err) {
	            console.error(err);
	        } else {
	            console.log("success!");
	        }
	    });
	    account.photo = '/uploads/'+file_name;
    }

    //console.log(this.__req.body);
    //return;

    account.firstname = this.__req.body.firstname === undefined ? '' : this.__req.body.firstname;
	account.lastname = this.__req.body.lastname === undefined ? '' : this.__req.body.lastname;
    account.email = this.__req.body.email === undefined ? '' : this.__req.body.email;
    account.number = this.__req.body.number === undefined ? '' : this.__req.body.number;
    account.company = this.__req.body.company === undefined ? '' : this.__req.body.company;
    account.description = this.__req.body.description === undefined ? '' : this.__req.body.description;
    account.website = this.__req.body.website === undefined ? '' : this.__req.body.website;
    //account.password = this.param('password');
    //account.usertype = this.param('usertype');

	var locations = this.__req.body.locations;
    //console.log(locations);


	if (locations !== undefined) {
		account.locations = [];
		if (Array.isArray(locations)) {
		    locations.forEach(function(address){
			    account.locations.push(JSON.parse(address));
			});
		} else {
		    account.locations.push(JSON.parse(locations));
	    }
    } else {
	    account.locations = [];
    }

	//console.log(account);

	var usermodel = self.models['user'];
    usermodel.findByIdAndUpdate(user._id, {$set: account}, function(err, inst){
        if (!err){
            //AccountController.settings.call(self);
            //console.log(inst);

            self.user = inst;
            self.render('account/settings');
            //console.log(err);
        }else{
            this.err_msg = err.message;
            //self.render();
            //AccountController.settings.call(self);
            //this.redirect('/');
            self.render('account/settings');
            console.log(err);
        }
    });
}

AccountController.logout= function() {
    this.req.logout();
    this.redirect('/');
}

//========== filters
AccountController.before(['settings', 'resume'], require('connect-ensure-login').ensureLoggedIn('account/login'));
AccountController.before('loginForm', require('connect-ensure-login').ensureLoggedOut('/'));

module.exports = AccountController;

