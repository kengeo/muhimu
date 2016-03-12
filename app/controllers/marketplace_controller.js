var locomotive = require('locomotive'),
	Controller = locomotive.Controller;

var passport = require('passport');
var mongoose = require('mongoose');
var con_login = require('connect-ensure-login');
var options = require('../files/options.json');
var moment = require('moment');
var url = require('url');

var MarketplaceController = new Controller();

MarketplaceController.show = function() {

    this.user = this.req.user;
    this.render();
}

MarketplaceController.single = function() {

    this.user = this.req.user;
	var id = this.param("marketplace_id"),
	user = this.req.user,
	marketplace = this.models['marketplace'],
	self = this;
	marketplace.findById(id, function(err, item) {
		if (!err) {
			self.marketplace = item;
			self.moment = moment;

			self.render();

		} else {
			console.log(err);
			//self.render("app_notfound");
		}
	});
}

MarketplaceController.editForm = function() {

    this.user = this.req.user;
    this.render();
}

MarketplaceController.checkoutForm = function() {

    this.user = this.req.user;
    this.render();
}

MarketplaceController.checkout = function() {

    this.user = this.req.user;
    // Set your secret key: remember to change this to your live secret key in production
	// See your keys here https://dashboard.stripe.com/account/apikeys
	var total = this.param('total') * 100;

	console.log(total);

	// (Assuming you're using express - expressjs.com)
	// Get the credit card details submitted by the form
	//var stripeToken = request.body.stripeToken;

	// Later...
	/*var customerId = getStripeCustomerId(user);

	stripe.charges.create({
	  amount: 1500, // amount in cents, again
	  currency: "usd",
	  customer: customerId
	});*/

    //this.render('marketplace/thankyou');
    this.redirect('marketplace/thankyou');
}

MarketplaceController.thankyou = function() {

    this.user = this.req.user;
    this.render();
}



//PagesController.before(['dashboard', 'solutions', 'services'], require('connect-ensure-login').ensureLoggedIn('account/login'));

MarketplaceController.before('*', function(req, res, next){
    // this executes before any action is invoked
    // if you want to insert a middleware
	require('connect-ensure-login').ensureLoggedIn('account/login')(req,res,next);
    // or
    //next();
});

module.exports = MarketplaceController;