"use strict";

var locomotive = require('locomotive')
    , Controller = locomotive.Controller;
var options = require('../files/options.json'),
	changecase = require('change-case'),
	mongoose = require('mongoose'),
	bcrypt  = require('bcrypt-nodejs'),
	fs = require('fs'),
	async = require('async'),
	_ = require('underscore');

var AjaxController = new Controller();

AjaxController.changepassword = function(req, res) {
	this.user = this.req.user;
	var user = this.req.user,
	account = {},
	oldpassword = this.param('oldpassword'),
	newpassword = this.param('newpassword'),
	confirmpassword = this.param('confirmpassword'),
	that = this;
	var output ={};

	account.password = bcrypt.hashSync(newpassword, bcrypt.genSaltSync(8), null);

	var usermodel = this.models['user'];

	if (bcrypt.compareSync(oldpassword, user.password)){
		usermodel.findByIdAndUpdate(user._id, {$set: account}, function(err, inst){
	        if (!err){
	            output = {"success": "Your password has been changed."};
	        }else{
	            output = {"error": "An error occured."};
	        }
	        that.res.send(JSON.stringify(output));
	    });
	} else {
		output = {"error": "Current password is wrong."};
		this.res.send(JSON.stringify(output));
	}

}

AjaxController.options = function(req, res) {
	this.user = this.req.user;
	var user = this.req.user,
	query = this.param('q'),
	option = this.param('option'),
	output = {},
	that = this;

	var model = this.models[option];

	//console.log(query +" "+studyareas);
	var r = new RegExp(query,'i');
	model.find()
	.where('name', { $regex: r })
	.select('id name')
	.exec(function(err, items){
        if ( !err){
            var data = items;
            //console.log(data);
            //section_id = parseInt(section_id) - 1;
			output = {
            	"data": data
            };

        }else{
	        console.log(err);
            //that.render("app_notfound");
        }
        //console.log(output);
		that.res.send(JSON.stringify(data));
    });
}

AjaxController.userComplete = function(req, res) {
	this.user = this.req.user;

	var usermodel = this.models['user'];

	usermodel.findById(this.user._id, function (err, item) {
		if (!err){
            item.isComplete = true;
			item.save();
        }else{
            output = {"error": "An error occured."};
        }
	});
}

AjaxController.resumesave = function(req, res) {
	var data = this.param('data');
	this.user = this.req.user;
	var user = this.req.user,
	update = {},
	output = {},
	that = this;

	update.resume = JSON.parse(data);
	//console.log(update.resume);
	//update.body = JSON.stringify(update.body);

	var usermodel = this.models['user'];

	usermodel.findById(user._id, function (err, item) {
		if (!err){
            item.resume = update.resume;
            //section_id = parseInt(section_id) - 1;
			item.save();
            output = {
	            	"success": "Saved",
					"date": Date.now()
	            };
        }else{
            output = {"error": "An error occured."};
        }
        that.res.send(JSON.stringify(output));
	});
}


AjaxController.download = function(req, res) {
	var project_id = this.param('project_id'),
	file = this.param('file');
	this.user = this.req.user;
	var user = this.req.user,
	filename = 'projects/'+project_id+'/'+file;

	console.log(filename + "sent;");

	this.res.download(filename, function(err){
		if (err) {
		// Handle error, but keep in mind the response may be partially-sent
		// so check res.headersSent
		} else {
		// decrement a download credit, etc.
		}
	});

}

AjaxController.addToCart = function(req, res) {
	var marketplace_id = this.param('marketplace_id'),
	user = this.req.user,
	output = {},
	input = {},
	that = this,
	in_cart = null;

	var marketplacemodel = this.models['marketplace'],
	usermodel = this.models['user'];

	marketplacemodel.findById(marketplace_id, function (err, item) {
		if (!err){
            input = {
            	id: marketplace_id,
				date: Date.now(),
				name: item.name,
				description: item.description,
				price: item.price
        	};

	        usermodel.findById(user.id, function (err, useritem) {
				if (!err){
		            var cart = useritem.cart;

					cart.forEach(function(item){
						if (item.id == marketplace_id) {
							in_cart = true;
							output = {"warning": "Item is already in your cart."};
							that.res.send(JSON.stringify(output));
						}
		    		});

					if(!in_cart) {
			    		cart.push(input);
						useritem.save();
			            output = {
			            	"success": cart.length,
							"date": Date.now(),
							"cart": cart
			            };
			            //console.log(output);
			            that.res.send(JSON.stringify(output));
			        }
				} else {
		            output = {"error": "An error occured."};
		            //console.log(output);
					that.res.send(JSON.stringify(output));
		        }

			});
        }
    });

}

AjaxController.apply = function(req, res) {
	var opportunity_id = this.param('opportunity_id'),
	user = this.req.user,
	output = {},
	input = {},
	that = this;

	var opportunitymodel = this.models['opportunities'];

	opportunitymodel.findById(opportunity_id, function (err, opportunity) {
		//console.log(item);

		if (!err){

			if (opportunity.applications) {
				var applications = opportunity.applications;
			} else {
				var applications = [];
			}

			//console.log(applications);

			input = {
            	"user": user._id,
				"date": Date.now()
        	};

        	applications.push(input);
        	opportunity.applications = applications;
        	//console.log(opportunity.applications);
			opportunity.save(function (error) {
				if (error) {
					handleError(res, error);
				} else {
					output = { "success": "You have applied successfully." };
					//console.log(output);
					that.res.send(JSON.stringify(output));
				}
			});

			//console.log(opportunity);


		} else {
            output = {"error": "An error occured."};
            //console.log(output);
			that.res.send(JSON.stringify(output));
        }
    });

}



//========== filters
//AjaxController.before('settings', require('connect-ensure-login').ensureLoggedIn('account/login'));
//AjaxController.before('loginForm', require('connect-ensure-login').ensureLoggedOut('/'));

module.exports = AjaxController;