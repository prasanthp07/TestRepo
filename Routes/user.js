//****************************Route File for the User***************

//Dependencies
var mongoose = require('mongoose');
var passport = require("passport");
var User = mongoose.model("User");
require("../Config/strategies/local");


module.exports = function (server) {

	//to register and authenticate user
	server.post('/user', function (req, res, next) {

		console.log(req.query);

		if (req.query.type && req.query.type === 'register') {

			// if the reqest type is Register

			console.log("Registration checking....");
			var user = {
				email: req.body.email,
				password: req.body.password
			};
			User.findOne({
				email: req.body.email
			}, function (err, match) {
				if (err) {
					return res.json(err);
				} else if (match) {
					res.json("User Already Exists...");
				} else {
					User.register(user, function (err, result) {

						if (err) {
							console.log("Error in Registration");
							return res.json(err);
						} else {
							if (result) {
								console.log("User Added*****\n " + result);
								res.json("User Registration Done");
							} else {
								res.json("User Already Exists...");
							}
						}
					});
				}
			});

		} else if (req.query.type && req.query.type === 'login') {

			//if request type is Login

			console.log("Login checking....");
			passport.authenticate('local', function (err, user, info) {
				if (err) {
					return next(err);
				}
				// Redirect if it fails
				if (!user) {
					return res.json("Invalid Email or Password");
				} else {
					return res.json({
						user: user,
						msg: "Success"
					});
				}
			})(req, res, next);
		} else {
			res.json("Unable to Process Request");
		}
	});

}
