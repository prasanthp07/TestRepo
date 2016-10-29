/******************************  Routes for Comments ****************************/

//Dependencies
var mongoose = require('mongoose');
var Article = mongoose.model("Article");
var Comment = mongoose.model("Comment");
var User = mongoose.model("User");

module.exports = function (server) {

	//to add a new comment
	server.post("/comments", function (req, res, next) {

		if (req.body) {

			var newComment = new Comment({
				text: req.body.text,
				article: req.body.article,
				user: req.body.user
			});

			newComment.save({}, function (err, result) {

				if (err) {
					res.json(err);
				} else {
					Article.findByIdAndUpdate({
						_id: req.body.article
					}, {
						$inc: {
							commentCount: 1
						}
					}).exec(function (err, reply) {
						if (err) {
							res.json("Error in Updating Comment Count")
						} else {
							console.log(reply);
							res.json(result);
						}
					});
				}
			});
		} else {
			res.end();
		}


	});

	//to get all comments based on articleId
	server.get("/comments", function (req, res, next) {

		console.log("Comment fetching...")

		console.log(req.query.articleId);
		if (req.query.articleId) {
			var populater = {
				path: 'user', //field to which data is populated
				model: 'User', //Name of the model from where data is populating
				select: 'email' //which all fields needs to be populated      
			}

			Comment.find({
					article: req.query.articleId
				}, {}, {
					sort: {
						createDate: -1
					}
				})
				.populate(populater)
				.exec(function (err, comments) {
					if (err) {
						res.json(err);

					} else {
						res.json(comments);
					}
				});
		} else {
			res.end();
		}
	});

}
