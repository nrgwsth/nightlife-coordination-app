var TwitterStrategy = require("passport-twitter").Strategy;

var User = require("../models/User.model");

var configAuth = require("./configAuth");

module.exports = function(passport) {
	passport.serializeUser(function(user, done){
		done(null, user.twitter.id);
	});

	passport.deserializeUser(function(id, done){
		User.findOne({'twitter.id':id}, function(err,user){
			done(err,user);
		})
	});

	passport.use(new TwitterStrategy({
		    consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL
	},
	function(token, tokenSecret, profile, done){
		process.nextTick(function() {
			User.findOne({'twitter.id': profile.id}, function(err, user) {
				if(err) {
					done(err);
				}
				if(user){
					done(null, user);
				} else{
					var newUser = new User();
					newUser.twitter.id          = profile.id;
                    newUser.twitter.token       = token;
                    newUser.twitter.username    = profile.username;
                    newUser.twitter.displayName = profile.displayName;
                    newUser.save(function(err) {
                    	if(err)
                    		throw err;
                    	return done(null, newUser);
                    })
				}
			})
		})
	}))
}
