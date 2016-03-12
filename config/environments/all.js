var express = require('express')
  , poweredBy = require('connect-powered-by')
  , util = require('util');
var passport = require('passport'),
    qt = require('quickthumb'),
    methodoverride = require('method-override'),
    bugsnag = require("bugsnag");
    var multer = require('multer');

    bugsnag.register("7d334cec2665a24b8a4fa217e80d2b59");


module.exports = function() {
  // Warn of version mismatch between global "lcm" binary and local installation
  // of Locomotive.
  if (this.version !== require('locomotive').version) {
    console.warn(util.format('version mismatch between local (%s) and global (%s) Locomotive module', require('locomotive').version, this.version));
  }

  // Configure application settings.  Consult the Express API Reference for a
  // list of the available [settings](http://expressjs.com/api.html#app-settings).
  this.set('views', __dirname + '/../../app/views');
  this.set('view engine', 'ejs');
  //this.set('view engine', 'hbs');
  //  this.set('view engine', 'jade');

  // Register EJS, hbs, jade as a template engine.
  this.engine('ejs', require('ejs').__express);
  // this.engine('hbs', require('handlebars'));
  // this.engine('hbs', require('express-hbs').express3);
  this.engine('jade', require('jade').__express);

  this.datastore(require('locomotive-mongoose'));

  //require('../passport')(passport); // pass passport for configuration

  // Override default template extension.  By default, Locomotive finds
  // templates using the `name.format.engine` convention, for example
  // `index.html.ejs`  For some template engines, such as Jade, that find
  // layouts using a `layout.engine` notation, this results in mixed conventions
  // that can cuase confusion.  If this occurs, you can map an explicit
  // extension to a format.
  /* this.format('html', { extension: '.jade' }) */

  // Register formats for content negotiation.  Using content negotiation,
  // different formats can be served as needed by different clients.  For
  // example, a browser is sent an HTML response, while an API client is sent a
  // JSON or XML response.
  /* this.format('xml', { engine: 'xmlb' }); */

  // Use middleware.  Standard [Connect](http://www.senchalabs.org/connect/)
  // middleware is built-in, with additional [third-party](https://github.com/senchalabs/connect/wiki)
  // middleware available as separate modules.
  this.use(bugsnag.requestHandler);
  this.use(poweredBy('Locomotive'));
  this.use(express.logger());
  this.use(express.favicon());
  //this.use(express.static(__dirname + '/../../projects'));
  this.use(qt.static(__dirname + '/../../public'));
  this.use(express.json());
  this.use(express.urlencoded());
  this.use(multer());
  //this.use(express.bodyParser());
  this.use(methodoverride('X-HTTP-Method-Override'));
  this.use(express.cookieParser());
  this.use(express.session({ secret: 'saf keys' }));

  this.use(passport.initialize());
  this.use(passport.session());

  this.use(bugsnag.errorHandler);

  this.use(this.router);

}
