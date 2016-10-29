//****************User Model Defenition******************** 


//Dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var _ = require('lodash');
var passwordHelper = require('../Helpers/password');

//Schema defenition
var userSchema = new Schema({
	email: {
		type: String
	},
	password: {
		type: String,
		select: false
	},
	passwordSalt: {
		type: String,
		select: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

//schema function to register a User
userSchema.statics.register = function (opts, callback) {
	var self = this;
	var data = _.cloneDeep(opts);

	//hash the password
	passwordHelper.hash(opts.password, function (err, hashedPassword, salt) {
		if (err) {
			return callback(err);
		}

		data.password = hashedPassword;
		data.passwordSalt = salt;
		//create the user
		self.model('User').create(data, function (err, user) {
			if (err) {
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

//Model
mongoose.model('User', userSchema);
