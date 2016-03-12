var passport = require("passport")
    ,dummy = 1;

// Draw routes.  Locomotive"s router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.

module.exports = function routes() {
    cl = require("connect-ensure-login");
    this.match("/", "pages#main");
    this.post("/", "account#create");
    this.match("tour", "pages#tour");
    this.match("pricing", "pages#pricing");
    this.match("businesses", "pages#businesses");
    this.match("contact", "pages#contact");
    this.match("developers", "pages#developers");
    this.match("terms", "pages#terms");
    this.match("privacy", "pages#privacy");

    this.match("dashboard", "dashboard#show");
	this.match("opportunities", "opportunities#show");
	this.match("marketplace", "marketplace#show");
	this.match("library", "library#show");
	this.match("services", "services#show");
	this.match('services/:usertype', "services#show");

	//========= account creation
    this.match("account/login", "account#loginForm");
    this.post("account/login", "account#login");

    /*this.match("account/login", passport.authenticate('local-login', {
            successReturnToOrRedirect: '/dashboard',
            failureRedirect: '/account/login' }
    ), {via:'post'});*/

	this.match("account/resume", "account#resume");
	this.match("account/settings", "account#settings");
	this.post("account/settings", "account#update");
	this.match("account/password", "account#password");
    this.match("account/signup", "account#signup");
    this.post("account/signup", "account#create");

    this.match("signup/individual", "account#individual");
    this.post("signup/individual", "account#create");

    this.match("signup/company", "account#company");
    this.post("signup/company", "account#create");

    this.match("signup/recruiter", "account#recruiter");
    this.post("signup/recruiter", "account#create");

    this.match("account/logout", "account#logout");


	//========= opportunitiess creation
    this.match("opportunities/new", "opportunities#createForm");
	this.post("opportunities/new", "opportunities#create");
	//this.match("opportunities", "opportunities#show");
	this.match("opportunities/:opportunities_id", "opportunities#single");
	this.match("opportunities/manage/:opportunities_id", "opportunities#manage");
	this.match("opportunities/edit/:opportunities_id", "opportunities#editForm");
	this.post("opportunities/edit/:opportunities_id", "opportunities#update");



	//========= marketplace creation
	//this.match("marketplace", "marketplace#show");
	this.match("marketplace/checkout", "marketplace#checkoutForm");
	this.post("marketplace/checkout", "marketplace#checkout");

	this.match("marketplace/thankyou", "marketplace#thankyou");

	this.match("marketplace/:marketplace_id", "marketplace#single");
	this.match("marketplace/edit/:marketplace_id", "marketplace#editForm");
	this.post("marketplace/edit/:marketplace_id", "marketplace#update");

	//========= user profiles
	this.match("profile/:user_id", "profile#show");

	//========= ajax calls
	this.post("account/ajax/usercomplete", "ajax#userComplete");
	this.post("ajax/usercomplete", "ajax#userComplete");

	this.match("ajax/options", "ajax#options");
	this.post("ajax/changepassword", "ajax#changepassword");
	this.post("ajax/resumesave", "ajax#resumesave");
	this.match("ajax/resumeget", "ajax#resumeget");
	this.post("ajax/apply", "ajax#apply");
	this.match("ajax/options", "ajax#options");

	this.match("admin/individuals", "admin#individuals");
	this.match("admin/companies", "admin#companies");
	this.match("admin/opportunities", "admin#opportunities");



	this.post("ajax/addtocart", "ajax#addToCart");

    //========== error handler

	middlewareTwo= function(req, res, next){
        c = 10;
        next();
    }

    middlewareOne  = function(req, res, next){
        c =10;
        next();
    }

    function isLoggedIn(req, res, next) {

		// if user is authenticated in the session, carry on
		if (req.isAuthenticated())
			return true;

		// if they aren't redirect them to the home page
		//res.redirect('/');
	}

    /*this.match('api/*', [ middlewareOne,         middlewareTwo ]);
    //resources
    this.namespace("api", function() {
        this.resources("jobPosts");
        this.resources("clients");
        this.resources("providers");
        this.resources("jobApplications");
        this.resources("lists");
        this.resources("states");

        // relational mapping
        this.resources("clients", function(){
            this.resources("jobPosts"); // api/clients/:client_id/jobposts
        })
        this.match('states/:state_code/cities', {
            controller: 'states',
            action: 'cities'
        });

        this.match('states/import/:city_or_state', {
            controller: 'states',
            action: 'importData'
        });

        this.match('client/:clientId/jobApplications/count', {
            controller: 'jobApplications',
            action: 'jobApplicationsCount'
        });

        this.match('client/:clientId/jobPosts/count', {
            controller: 'jobPosts',
            action: 'jobpostsCount'
        });

        this.match('clients/:clientId/jobposts', {
            controller: 'jobPosts',
            action: 'index'
        });

        this.match('providers/:providerId/jobposts', {

            controller: 'jobPosts',
            action: 'index'
        });

        this.match('providers/:providerId/clients', {
            controller: 'clients',
            action: 'index'
        });

        this.match('jobPosts/:jobPostId/jobApplications', {
            controller: 'jobApplications',
            action: 'index'
        });


    });*/

}

