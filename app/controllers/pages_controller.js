var locomotive = require('locomotive')
  , Controller = locomotive.Controller;
var passport = require('passport');
var con_login = require('connect-ensure-login');
var moment = require('moment');
var maxmind = require('maxmind');

var PagesController = new Controller();

PagesController.main = function() {
	this.user = this.req.user; // from passport
	this.moment = moment;
	var opportunity = this.param("opportunities_id");

	maxmind.init('public/assets/geolocation/GeoIP.dat');
	var ip =  this.__req.headers['x-forwarded-for'] || this.__req.connection.remoteAddress ||  this.__req.socket.remoteAddress || this.__req.connection.socket.remoteAddress;
	//console.log(ip);
	var country = maxmind.getCountry(ip);

	//var country = "Grenada";
	//console.log(country);

	var opportunities = this.models['opportunities'],
        self = this;

    opportunities.find('title description location _id createDate moredetails',null, {sort:{ createDate: -1 }}).where('status').equals('Open').where('location.country').equals(country.name).populate('createdBy').exec(function(err, opportunitieslist){
        if(!err){
            self.country = country.name;
            self.list = opportunitieslist;
            self.render();

        }else{
            self.render('/error');
        }
    });
    //this.render();
}
PagesController.tour = function() {
	this.user = this.req.user; // from passport
	this.render();
}
PagesController.businesses = function() {
	this.user = this.req.user; // from passport
	this.render();
}
PagesController.pricing = function() {
	this.user = this.req.user; // from passport
	this.render();
}

PagesController.contact = function() {
	this.user = this.req.user; // from passport
	this.render();
}

PagesController.developers = function() {
	this.user = this.req.user; // from passport
	this.render();
}

PagesController.terms = function() {
	this.user = this.req.user; // from passport
	this.render();
}

PagesController.privacy = function() {
	this.user = this.req.user; // from passport
	this.render();
}

//PagesController.before(['dashboard', 'solutions', 'services'], require('connect-ensure-login').ensureLoggedIn('account/login'));
/*
PagesController.before('*', function(req, res, next){
    // this executes before any action is invoked
    // if you want to insert a middleware
//    require('connect-ensure-login').ensureLoggedIn('account/login')(req,res,next);
    // or
    next();
});
*/
module.exports = PagesController;
