var locomotive = require('locomotive'),
	Controller = locomotive.Controller;
var passport = require('passport');
var mongoose = require('mongoose');
var con_login = require('connect-ensure-login');
var options = require('../files/options.json');
var moment = require('moment');
var url = require('url');
var async = require('async');

var ProjectsController = new Controller();
ProjectsController.show = function() {
	this.user = this.req.user;
	var id = this.param("project_id");
	var user = this.req.user;
	var project = this.models['projects'];
	var self = this;
	project.findById(id, function(err, item) {
		if (!err) {
			self.project = item;
			self.render();
		} else {
			self.render("app_notfound");
		}
	});
	//this.render();
}
ProjectsController.createForm = function() {
	this.user = this.req.user;
	this.render();
}
ProjectsController.create = function() { //register or signup
	this.user = this.req.user;
	var project = mongoose.model('project');
	var item = new project();
	var user = this.req.user;
	item.name = this.param('project');
	item.type = this.param('type');
	item.category = this.param('category');
	var services = this.param('services');
	item.services = [];
	if (services) {
		services.forEach(function(service) {
			//console.log(JSON.parse(address));
			service = JSON.parse(service);
			//console.log(address.street);
			item.services.push(service);
		});
	}
	item.createdBy = user;
	var self = this;
	item.save(function(err, item) {
		if (err) return self.render("create", {
			message: "error found"
		});
		self.project = item;
		//console.log(self.project._id);
		return self.redirect('/projects/edit/' + self.project._id);
		//self.redirect('/project/edit');
	});
}
ProjectsController.editForm = function(id) {
	this.user = this.req.user;
	var id = this.param("project_id");
	var user = this.req.user;
	var project = this.models['projects'];
	var self = this;
	project.findById(id, function(err, item) {
		if (!err) {
			self.project = item;
			self.moment = moment;
			self.hostname = self.__req.headers.host;
			if (self.project.type == "written") {
				self.render("edit_written_form");
			} else {
				self.render("edit_form");
			}
		} else {
			console.log(err);
			//self.render("app_notfound");
		}
	});
}
ProjectsController.edit = function() {
/*var client = {};
    var client_id = this.param("client_id");
    var user = this.req.user;
    var self = this;

    client.name=this.param('app_name');
    client.client_secret=this.param('client_secret');
    client._creator = user;


    var client = this.models['client'];
    client.findByIdAndUpdate(client_id, client, function(err, inst){
        if (!err){
            UserController.listApp.call(self);
        }else{
            this.err_msg = err.message;
            self.render('add_app_form');
        }
    });*/
}
ProjectsController.publishForm = function() {
	this.user = this.req.user;
	var id = this.param("project_id");
	var user = this.req.user,
	project = this.models['projects'],
	author = this.models['user'],
	self = this,
	author_id = null;

	async.parallel(
	    {
	        projects: function(callback){
	            project.findById(id, function(err, projects) {
					if (!err) {
						callback(err, projects);
						//self.project = item;
						//author_id = projects._id;
						//console.log(projects);
						//self.render();
					} else {
						self.render("app_notfound");
					}
				});
	        },
	        authors: function(callback){
	            //console.log(async.parallel.projects._id);
	            author.findById(self.author_id, function(err, authors) {
					if (!err) {

						callback(err, authors);
					}
				});
	        },
	    },
	    function(e, results){
	        // can use r.team and r.games as you wish
	        self.results = results;
	        //console.log(results);
	        self.render();
	    }
	);

	/*async.parallel(
	    {
	        projects: function(callback){
	            project.find(
			    	{createdBy: user._id},
			    	null,
			    	{sort:{ createDate: -1 }},
			    	function(err, projects){
				        if ( !err){
				            //self.projects = projects;
				            callback(err, projects);
				        }else{
				            self.render("app_notfound");
				        }

			    });
	        },
	        opportunities: function(callback){
	            opportunity.find(
			    	{createdBy: user._id},
			    	null,
			    	{sort:{ createDate: -1 }},
			    	function(err, opportunities){
				        if ( !err){
				        	//self.solutions = solutions;
							callback(err, opportunities);
				        }else{
				        	self.render("app_notfound");
				        }

			    });
	        },
	    },
	    function(e, results){
	        // can use r.team and r.games as you wish
	        self.results = results;
	        self.render();
	    }
	);*/


}
ProjectsController.publish = function() {
	this.user = this.req.user;
	var marketplace = mongoose.model('marketplace_item');
	var item = new marketplace();
	var user = this.req.user;
	item.name = this.param('name');
	item.description = this.param('description');
	item.price = this.param('price');
	item.category = this.param('category');
	item.createdBy = user;
	var self = this;
	item.save(function(err, item) {
		if (err) return self.render("create", {
			message: "error found"
		});
		self.marketplace = item;
		//console.log(self.project._id);
		return self.redirect('/marketplace/' + self.marketplace._id);
		//self.redirect('/project/edit');
	});
}
//ProjectController.before(['dashboard', 'solutions', 'services'], require('connect-ensure-login').ensureLoggedIn('account/login'));
ProjectsController.before('*', function(req, res, next) {
	// this executes before any action is invoked
	// if you want to insert a middleware
	require('connect-ensure-login').ensureLoggedIn('account/login')(req, res, next);
	// or
	//next();
});
module.exports = ProjectsController;