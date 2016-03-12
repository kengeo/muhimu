var locomotive = require('locomotive'),
  Controller = locomotive.Controller,
  options = require('../files/options.json');
var fs = require('fs');
var gravatar = require('gravatar');
var _ = require('lodash')
var Mustache = require('mustache');

var ProfileController = new Controller();

ProfileController.show = function() {
	//this.user = this.req.user;
	if ( ! id)
	var id = this.param("user_id");
	var user = this.req.user;
	var profile = this.models['user'];
	this.user = this.req.user;
	//this.options = options;
	var self = this;
    profile.findById(id, function(err, item){
       if ( !err){
	      self.profile = item;
          self.render();
       }else{
           self.render("app_notfound");
       }

    });
    //this.render();
}

//ServicesController.before([], require('connect-ensure-login').ensureLoggedIn('account/login'));

ProfileController.before('*', function(req, res, next){
    // this executes before any action is invoked
    // if you want to insert a middleware
	require('connect-ensure-login').ensureLoggedIn('account/login')(req,res,next);
    // or
    //next();
});

module.exports = ProfileController;
