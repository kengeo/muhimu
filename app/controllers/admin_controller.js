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
    changecase = require('change-case'),
    moment = require('moment');

/*var transport = nodemailer.createTransport(smtpTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    auth: {
        user: 'user',
        pass: 'pass'
    }
}));*/

var transport = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

var AdminController = new Controller();

AdminController.individuals = function() {
	this.user = this.req.user;
	var usertype = this.param("usertype");
	this.moment = moment;

	var users = this.models['user'],
        self = this;

	users.find('firstname lastname photo _id locations', null, {sort:{ createDate: -1 }})
	.where("usertype", "Individual")
    .exec(function(err, userlist){
        if(!err){
            self.list = userlist;
            self.render();
        }else{
            self.render('/error');
        }
    });
    /*
    users.find('firstname lastname photo _id', null, {sort:{ createDate: -1 }})
    .populate('createdBy')
    .where('status').equals('Open')
    .where('location.country').equals(country.name)
    .exec(function(err, userlist){
        if(!err){
            self.list = userlist;
            self.render();
        }else{
            self.render('/error');
        }
    });*/
    //this.render();
}

AdminController.companies = function() {
	this.user = this.req.user;
	var usertype = this.param("usertype");
	this.moment = moment;

	var users = this.models['user'],
        self = this;

	users.find('firstname lastname photo _id locations', null, {sort:{ createDate: -1 }})
	.where("usertype", "Company")
    .exec(function(err, userlist){
        if(!err){
            self.list = userlist;
            self.render();
        }else{
            self.render('/error');
        }
    });
    /*
    users.find('firstname lastname photo _id', null, {sort:{ createDate: -1 }})
    .populate('createdBy')
    .where('status').equals('Open')
    .where('location.country').equals(country.name)
    .exec(function(err, userlist){
        if(!err){
            self.list = userlist;
            self.render();
        }else{
            self.render('/error');
        }
    });*/
    //this.render();
}

AdminController.opportunities = function() {
	this.user = this.req.user;
	var usertype = this.param("usertype");
	this.moment = moment;

	var opportunity = this.models['opportunities'],
        self = this;

	opportunity.find('title createdBy createDate photo _id locations status applications', null, {sort:{ createDate: -1 }})
	.populate('createdBy')
    .exec(function(err, opportunitylist){
        if(!err){
            self.list = opportunitylist;
            self.render();
        }else{
            self.render('/error');
        }
    });
    /*
    users.find('firstname lastname photo _id', null, {sort:{ createDate: -1 }})
    .populate('createdBy')
    .where('status').equals('Open')
    .where('location.country').equals(country.name)
    .exec(function(err, userlist){
        if(!err){
            self.list = userlist;
            self.render();
        }else{
            self.render('/error');
        }
    });*/
    //this.render();
}



//========== filters
AdminController.before('*', function(req, res, next){
    // this executes before any action is invoked
    // if you want to insert a middleware
	require('connect-ensure-login').ensureLoggedIn('account/login')(req,res,next);
    // or
    //next();
    if (this.req.user && (this.req.user.isAdmin === true)) {
        next();
      } else {
        this.res.send(401, 'Unauthorized');
        //this.render('/', {message: "You Shall NOT Enter!"});
      }
    }
);
AdminController.before('loginForm', require('connect-ensure-login').ensureLoggedOut('/'));

module.exports = AdminController;

