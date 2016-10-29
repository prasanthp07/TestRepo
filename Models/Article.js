//******************************  Article Model Defenition *********************************

//Dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

//Schema defenition
var articleSchema = new Schema({
	title: {
		type: String
	},
	discription: {
		type: String
	},
	content: {
		type: String
	},
	imageUrl: {
		type: String
	},
	type: {
		type: String
	},
	user: {
		type: ObjectId,
		ref: 'User'
	},
	createdDate: {
		type: Date,
		default: Date.now
	},
	viewCount: {
		type: Number,
		default: 0
	},
	status: {
		type: String,
		default: 'pending'
	},
	tags: {
		type: [String]
	},
	commentCount: {
		type: Number,
		default: 0
	}

});

//Model
mongoose.model('Article', articleSchema);
