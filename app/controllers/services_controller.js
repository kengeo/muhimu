var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var ServicesController = new Controller();

ServicesController.show = function() {
	this.user = this.req.user;
	var usertype = this.param("usertype");
	if ( ! usertype) {
		var url = {'usertype': {$in: ['attorney', 'designer', 'editor', 'engineer', 'investor', 'manufacturer', 'prototyper']}};
	} else {
		var url = {'usertype': usertype};
	}
	
	var service = this.models['user'],
        self = this;

    service.find(url, 'firstname lastname photo _id', function(err, servicelist){
        if(!err){
            self.list = servicelist;
            self.render('show');
        }else{
            self.render('/error');
        }

    });
    //this.render();
}

//ServicesController.before(['dashboard', 'solutions', 'services'], require('connect-ensure-login').ensureLoggedIn('account/login'));

ServicesController.before('*', function(req, res, next){
    // this executes before any action is invoked
    // if you want to insert a middleware
	require('connect-ensure-login').ensureLoggedIn('account/login')(req,res,next);
    // or
    //next();
});

module.exports = ServicesController;
