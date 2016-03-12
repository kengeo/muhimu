var locomotive = require('locomotive')
  , Controller = locomotive.Controller;
var mongoose = require('mongoose');
var con_login = require('connect-ensure-login');
var options = require('../files/options.json');
var moment = require('moment');
var async = require('async');


var DashboardController = new Controller();

DashboardController.show = function() {
	this.user = this.req.user;
    var user = this.req.user;
	var project = this.models['projects'];
	var opportunity = this.models['opportunities'];
	var self = this;
	self.moment = moment;

    if (user.usertype === "Company") {
	    async.parallel(
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
		);
	} else {
		self.render();
	}

    //this.user = this.req.user;
    //this.render();
}

//PagesController.before(['dashboard', 'solutions', 'services'], require('connect-ensure-login').ensureLoggedIn('account/login'));
DashboardController.before('*', function(req, res, next){
    // this executes before any action is invoked
    // if you want to insert a middleware
	require('connect-ensure-login').ensureLoggedIn('account/login')(req,res,next);
    // or
    //next();
});

module.exports = DashboardController;
