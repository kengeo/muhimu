var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var LibraryController = new Controller();

LibraryController.show = function() {

    this.user = this.req.user;
    this.render();
}

//PagesController.before(['dashboard', 'solutions', 'services'], require('connect-ensure-login').ensureLoggedIn('account/login'));

LibraryController.before('*', function(req, res, next){
    // this executes before any action is invoked
    // if you want to insert a middleware
	require('connect-ensure-login').ensureLoggedIn('account/login')(req,res,next);
    // or
    //next();
});

module.exports = LibraryController;
