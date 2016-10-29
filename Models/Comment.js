//****************************** Comment Model Defenition  ******************************* 


//Dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

//Schema defenition
var commentSchema = new Schema({
	text: {
		type: String
	},
	createDate: {
		type: Date,
		default: Date.now
	},
	article: {
		type: ObjectId,
		ref: 'Article'
	},
	user: {
		type: ObjectId,
		ref: 'User'
	}
});

//Model
mongoose.model('Comment', commentSchema);
