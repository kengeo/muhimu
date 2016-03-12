var locomotive = require('locomotive'),
	Controller = locomotive.Controller;
var passport = require('passport');
var mongoose = require('mongoose');
var con_login = require('connect-ensure-login');
//var options = require('../files/options.json');
var moment = require('moment');
var maxmind = require('maxmind');

var OpportunitiesController = new Controller();

OpportunitiesController.show = function() {
	this.user = this.req.user;
	this.moment = moment;
	var opportunity = this.param("opportunities_id");

	maxmind.init('public/assets/geolocation/GeoIP.dat');
	var ip =  this.__req.headers['x-forwarded-for'] || this.__req.connection.remoteAddress ||  this.__req.socket.remoteAddress || this.__req.connection.socket.remoteAddress;
	//console.log(ip);
	var country = maxmind.getCountry(ip);

	var opportunities = this.models['opportunities'],
        self = this;

    opportunities.find('title _id createDate location', null, {sort:{ createDate: -1 }})
    .populate('createdBy')
    .where('status').equals('Open')
    //.where('remote').equals(true)
    .or([{ 'remote': true }, { 'location.country': country.name }])
    //.where('location.country').equals(country.name)
    .exec(function(err, opportunitieslist){
        if(!err){
            self.country = country.name;
            self.list = opportunitieslist;
            self.render('show');
        }else{
            self.render('/error');
        }
    });
    //this.render();
}

OpportunitiesController.createForm = function() {
	this.user = this.req.user;
	this.render();
}

OpportunitiesController.manage = function() {
	var id = this.param("opportunities_id");
	this.user = this.req.user;

	/*var opp = this.param("usertype");
	if ( ! usertype) {
		var url = {'usertype': {$in: ['attorney', 'designer', 'editor', 'engineer', 'investor', 'manufacturer', 'prototyper']}};
	} else {
		var url = {'usertype': usertype};
	}*/

	var opportunitymodel = this.models['opportunities'],
		usermodel = this.models['user'],
        self = this;

    opportunitymodel.findById(id, function(err, applicationlist){
        var userlist = applicationlist.applications;
		var list = [];

        userlist.forEach(function(user){
	        list.push(user.user);
	    });

		//console.log(list);

		usermodel.find({
			'_id': { $in: list}
    	}, function(err, users){

	        //console.log(users);

	        if(!err){
	            self.users = users;
	            self.render('manage');
	        }else{
	            self.render('/error');
	        }

	    });

    });
	//this.render();
}

OpportunitiesController.create = function() {
	this.user = this.req.user;
    var opportunities = mongoose.model('opportunity');
    var opportunity = new opportunities();
	var user = this.req.user;

    opportunity.title = this.param('title');
    opportunity.category = this.param('category');
    opportunity.type = this.param('jobtype');
    opportunity.level = this.param('level');
    opportunity.status = this.param('status');
    opportunity.relocation = this.param('relocationassist') ? true : false;
    opportunity.remote = this.param('remoteworking') ? true : false;
    opportunity.location = JSON.parse(this.param('joblocation'));
    opportunity.description = this.param('description') === undefined ? '' : this.param('description');
    opportunity.moredetails = this.param('moredetails') === undefined ? '' : this.param('moredetails');

    //var services = this.param('services');
    //item.services = [];

    /*if (files) {
		services.forEach(function(service){
		   	service = JSON.parse(service);
		  	item.services.push(service);
		});
	}*/

    opportunity.createdBy = user;

    console.log(opportunity);

	var self = this;
    opportunity.save(function (err, opportunity) {
        if (err) {
            return self.render("create", {message:"error found"});
        }
		self.opportunity = opportunity;
		//console.log(self.project._id);
        return self.redirect('/opportunities/edit/'+self.opportunity._id);
        //self.redirect('/project/edit');
    });
}

OpportunitiesController.editForm = function(id) {
	var user = this.req.user;
	this.user = this.req.user;
	if ( ! id) id = this.param("opportunities_id");
	var user = this.req.user;
	var opportunities = this.models['opportunities'];
	var self = this;
    opportunities.findById(id, function(err, item){
       if ( !err){
          self.opportunity = item;
          self.render("edit_form");

       }else{
           console.log(err);
           //self.render("app_notfound");
       }

    });

}

OpportunitiesController.update = function(id) {
	var id = this.param("opportunities_id");
	var user = this.req.user;
    this.user = this.req.user;
    var opportunity = {};
    var self = this;

	opportunity.title = this.param('title');
    opportunity.category = this.param('category');
    opportunity.type = this.param('jobtype');
    opportunity.level = this.param('level');
    opportunity.status = this.param('status');
    opportunity.relocation = this.param('relocationassist') ? true : false;
    opportunity.remote = this.param('remoteworking') ? true : false;
    opportunity.location = JSON.parse(this.param('joblocation'));
    opportunity.description = this.param('description') === undefined ? '' : this.param('description');
    opportunity.moredetails = this.param('moredetails') === undefined ? '' : this.param('moredetails');

	console.log(opportunity);

    var opportunities = this.models['opportunities'];
    opportunities.findByIdAndUpdate(id, {$set: opportunity}, function(err, opportunity){
        if (!err){
            self.opportunity = opportunity;
            self.render('edit_form');
            //console.log(err);
        }else{
            this.err_msg = err.message;
            //self.render();
            //AccountController.settings.call(self);
            //this.redirect('/');
        }
    });
}

OpportunitiesController.single = function() {
	this.user = this.req.user;
	if ( ! id)
	var id = this.param("opportunities_id");
	var user = this.req.user;
	var opportunities = this.models['opportunities'];
	var self = this;
    opportunities.findById(id).populate("createdBy").exec(function(err, item){
       if ( !err){
          self.opportunity = item;
          self.render();
       }else{
           self.render("app_notfound");
       }

    });
}


OpportunitiesController.before(['update', 'editForm', 'createForm', 'manage', 'show'], require('connect-ensure-login').ensureLoggedIn('account/login'));

/*OpportunitiesController.before('*', function(req, res, next){
    // this executes before any action is invoked
    // if you want to insert a middleware
	require('connect-ensure-login').ensureLoggedIn('account/login')(req,res,next);
    // or
    //next();
});*/

module.exports = OpportunitiesController;