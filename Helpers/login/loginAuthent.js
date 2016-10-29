//****************************** Login Authentication ****************************************

//Dependencies
var mongoose = require('mongoose');
var User = mongoose.model("User");
var passwordHelper = require('../../Helpers/password');

module.exports.AuthenticateLogin = AuthenticateLogin;


/*
 * Funaction to authenticate user login
 * @params :email
 * @params :password
 * @params :callback
 */
function AuthenticateLogin(email, password, callback) {

	User.findOne({
		email: email
	}).select('+password +passwordSalt _id').exec(function (err, user) {
		if (err) {
			return callback(err, null);
		}

		// no user found just return the empty user
		if (!user) {
			return callback(err, user);
		}

		// verify the password with the existing hash from the user
		passwordHelper.verify(password, user.password, user.passwordSalt, function (err, result) {

			if (err) {
				return callback(err, null);
			}

			// if password does not match don't return user
			if (result === false) {
				return callback(err, null);
			}

			// remove password and salt from the result
			user.password = undefined;
			user.passwordSalt = undefined;
			// return user if everything is ok
			callback(err, user);
		});
	});
};
