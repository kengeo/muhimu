/**
 * Created with IntelliJ IDEA.
 * User: saf
 * To change this template use File | Settings | File Templates.
 */
var locomotive = require('locomotive')
    , Controller = locomotive.Controller
    , oauth2 = require('../auth/oauth2.js')

var passport = require('passport');
var mongoose = require('mongoose');
var con_login = require('connect-ensure-login');

var UserController = new Controller();

//=========== user settings
/**
 * list all apps
 */
UserController.listApp= function() {

    user = this.req.user; // from passport
    var client = this.models['client'];
//    client.
//    this.apps =
    var client = this.models['client'],
        self = this;

    client.find({_creator:user.id}, function(err, clients){
        if(!err){
            self.apps = clients
            self.render('list_app');
        }else{
            self.render('/error');
        }

    });
}

/**
 *
 */
UserController.addAppForm= function() {
    var ut = require('../util/util.js');
    this.client_secret = ut.random_key();
    this.render("add_app_form");

}

UserController.addApp= function() {
    var client = this.models['client'];
    // ensure logged in before
    var self = this;
    var user = this.req.user;

    this.password =  require('crypto').createHash('md5').digest('hex');

    var client = {};
    client.name=this.param('app_name');
    client.client_secret=this.param('client_secret');
    client.callback_uri=this.param('callback_uri');
    client._creator = user;

    client.create(client, function(err, inst){
        if (!err){
            user._clients.push(inst);

            UserController.editAppForm.call(self, inst._id);
        }else{
            this.err_msg = err.message;
            self.render('add_app_form');
        }
    });

}

UserController.editAppForm= function(id) {
    if ( ! id) id = this.param("client_id");
    var client = this.models['client'];
    var self = this;

    client.findById(id, function(err, inst){
       if ( !err){
           self.client = inst;
           self.render("edit_app_form");
       }else{
           self.render("app_notfound");
       }

    });


}

UserController.editApp= function() {
    var client = {};
    var client_id = this.param("client_id");
    var user = this.req.user;
    var self = this;

    client.name=this.param('app_name');
    client.client_secret=this.param('client_secret');
//    client._creator = user;


    var client = this.models['client'];
    client.findByIdAndUpdate(client_id, client, function(err, inst){
        if (!err){
            UserController.listApp.call(self);
        }else{
            this.err_msg = err.message;
            self.render('add_app_form');
        }
    });
}

UserController.removeApp= function() {
    var client = this.models['client'];
    var client_id = this.param('client_id');

    client.findByIdAndRemove(client_id, function(err, inst){
        if (!err){

        }else{
            this.err_msg = err.message;
            self.render('/error');
        }
    });

    UserController.listApp.call(this);
}

//================== oAuth2 processes

UserController.authDialog= function() {
    var req = this.req;
    this.data = { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client }

    this.render('auth/dialog');
}

UserController.authDicision= function() {

}

UserController.authToken= function() {

}


UserController.before('*', function(req, res, next){
    require('connect-ensure-login').ensureLoggedIn('account/login')(req,res,next);
 // or
// next();
});


module.exports = UserController;