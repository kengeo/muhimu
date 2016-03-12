/**
 * Created with IntelliJ IDEA.
 * User: saf
 */

var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , BasicStrategy = require('passport-http').BasicStrategy
    , ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy
    , BearerStrategy = require('passport-http-bearer').Strategy
    , mongoose = require('mongoose')



    var user = mongoose.models['user'];
    //============= this is for CS-API local authentication
    passport.use(new LocalStrategy({
            usernameField: 'email'
        },
        function(email, password, done) {
            // Find the user by username.  If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure.  Otherwise, return the authenticated `user`.
            user.authenticate(email, password, function(err, user) {
                return done(err, user);
            });
        }
    ));

//=============  These strategies are used to authenticate registered OAuth clients.
/**
 *   purpose: to protect the `token` endpoint, which consumers use to obtain
 * access tokens.
 */
passport.use(new BasicStrategy(
    function(client_id, client_secret, done) {
        var client = mongoose.models['client'];
        client.findById(client_id, function(err, client) {
            if (err) { return done(err); }
            if (!client) { return done(null, false); }
            if (client.client_secret != client_secret) { return done(null, false); }
            return done(null, client);
        });
    }
));

passport.use(new ClientPasswordStrategy(
    function(client_id, client_secret, done) {
        var client = mongoose.models['client'];
        client.findById(client_id, function(err, client) {
            if (err) { return done(err); }
            if (!client) { return done(null, false); }
            if (client.client_secret != client_secret) { return done(null, false); }
            return done(null, client);
        });
    }
));

/**
 * BearerStrategy
 *
 * this is used to authenticate users based on an access token (aka a
 * bearer token).  The user must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(new BearerStrategy(
    function(accessToken, done) {
        var AccessToken = mongoose.models['AccessToken']
            , user = mongoose.models['user']
            , client = mongoose.models['client'];

        AccessToken.findOne({token:accessToken}, function(err, token) {
            if (err) { return done(err); }

            if (!token) {
                return done(null, false);
            }

            if(token.user_id != null) {
                user.findById(token.user_id, function(err, user) {
                    if (err) { return done(err); }
                    if (!user) { return done(null, false); }
                    // to keep this example simple, restricted scopes are not implemented,
                    // and this is just for illustrative purposes
                    //todo:
                    var info = { scope: '*' }
                    done(null, user, info);
                });
            }else{
                //The request came from a client only since userID is null
                //therefore the client is passed back instead of a user
                client.findById(token.client_id, function(err, client) {
                    if(err) { return done(err); }
                    if(!client) { return done(null, false); }
                    // to keep this example simple, restricted scopes are not implemented,
                    // and this is just for illustrative purposes
                    var info = { scope: '*' }
                    done(null, client, info);
                });
            }
        });
    }
));



    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        user.findById(id, function (err, user) {
            done(err, user);
        });
    });

