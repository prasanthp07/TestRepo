//*******************************Local Strategy *********************************************

//Dependencies
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var login = require('../../Helpers/login/loginAuthent');


//Defenition of local strategy for user authentication
passport.use('local', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function (req, email, password, done) {
		login.AuthenticateLogin(email, password, function (err, user) {
			if (err) {
				return done(null, false);
			}

			if (!user) {
				return done(null, false);
			}

			return done(null, user);
		});
	}
));
