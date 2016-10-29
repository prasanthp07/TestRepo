/******************************  Routes for Songs ****************************/

//Dependencies
var mongoose = require('mongoose');
var Article = mongoose.model("Article");
var Comment = mongoose.model("Comment");

module.exports = function (server) {


	//Add new article 
	server.post('/articles', function (req, res, next) {
		console.log(req.body);
		console.log(req.file);
		var newArticle;
		var tags = [];
		if (req.body.tags) {
			tags = req.body.tags.split(',');
		}

		if (req.body) {
			if (req.body.type === "Text") {
				newArticle = new Article({
					title: req.body.title,
					discription: req.body.discription,
					content: req.body.content,
					type: req.body.type,
					user: req.body.user,
					tags: tags
				});
			} else if (req.body.type === "Image") {
				if (req.file) {
					newArticle = new Article({
						title: req.body.title,
						discription: req.body.discription,
						content: req.body.content,
						type: req.body.type,
						user: req.body.user,
						tags: tags,
						imageUrl: req.file.path
					});
				} else {
					res.json("File Detail Missing");
				}
			} else {
				res.json("Unknown Parameter");
			}
			newArticle.save({}, function (err, result) {
				if (err) {
					res.json(err);
				} else {
					console.log("success");
					res.json(result);
				}
			});
		}
	});

	//Update article details
	server.put('/articles', function (req, res, next) {

		console.log("Article Updation:");
		var tags = [];
		if (typeof (req.body.tags) == 'string') {
			tags = req.body.tags.split(',');
		} else {
			tags = req.body.tags;
		}

		if (req.body.title) {
			Article.findByIdAndUpdate({
				_id: req.body._id
			}, {
				$set: {
					title: req.body.title,
					discription: req.body.discription,
					content: req.body.content,
					tags: tags

				}
			}).exec(function (err, result) {
				if (err) {
					res.json(err);
				} else {
					res.json(result);
				}
			});
		} else {
			res.send("Error in Updating Article");
		}
	});

	//articles request from the administrator 
	server.get('/articles/admin', function (req, res, next) {
		fetchArticles(req, res, next);
	});

	//article request from the users
	server.get('/articles', function (req, res, next) {
		var skipValue = 0;
		var limitvalue = 10;
		var populater = {
			path: 'user', //field to which data is populated
			model: 'User', //Name of the model from where data is populating
			select: 'email' //which all fields needs to be populated      
		};

		if (req.query.skip) {
			fetchUserArticles(req, res, next);
		} else if (req.query.articleId && req.query.viewAdd) {
			fetchArticle(req, res, next);
		} else if (req.query.tagName && req.query.tagSkip) {
			fetchTagArticle(req, res, next);
		} else if (req.query.latestInfo) {
			fetchLatestInfo(req, res, next);
		} else {
			Article.find({})
				.populate(populater)
				.exec(function (err, articles) {
					if (err) {
						res.json(err);

					} else {
						res.json(articles);
					}
				});

		}
	});

	//article delete request from the user
	server.delete('/articles', function (req, res, next) {
		console.log("Delete Request:");
		removeArticle(req, res, next);

	});

	//article delete request from the administrator
	server.delete('/articles/admin', function (req, res, next) {
		console.log("AdminDelete:");
		removeArticle(req, res, next);
	});

	//Editing article status by administror
	server.put('/articles/admin', function (req, res, next) {

		console.log(req.query);
		if (req.query.status && req.query.articleId) {
			Article.findByIdAndUpdate({
				_id: req.query.articleId
			}, {
				$set: {
					status: req.query.status
				}
			}).exec(function (err, result) {
				if (err) {
					res.json(err);
				} else {
					res.json(result);
				}
			});
		} else {
			res.send("Error in Updating status");
		}
	});

	//function to fetch articles of a user if userId, else display all articles
	function fetchUserArticles(req, res, next) {
		var skipValue = 0;
		var limitvalue = 10;
		var populater = {
			path: 'user', //field to which data is populated
			model: 'User', //Name of the model from where data is populating
			select: 'email' //which all fields needs to be populated      
		}

		skipValue = req.query.skip;
		console.log("Articles reqested");
		if (req.query.userId) {
			Article.find({
					user: req.query.userId,
					status: "active"
				}, {}, {
					limit: limitvalue,
					skip: skipValue,
					sort: {
						createdDate: -1
					}
				})
				.populate(populater)
				.exec(function (err, articles) {
					if (err) {
						res.json(err);

					} else {
						Article.count({
							user: req.query.userId,
							status: "active"
						}, function (err, result) {
							if (err) {
								res.json(err);
							} else {
								var articleData = {
									article: articles,
									count: result
								};
								res.json(articleData);
							}
						});
					}
				});
		} else {
			next();
			fetchArticles(req, res, next);
		}
	}

	//function to fetch articles based on status
	function fetchArticles(req, res, next) {

		var skipValue = 0;
		var limitvalue = 10;
		var query = {
			status: "active"
		};
		var populater = {
			path: 'user', //field to which data is populated
			model: 'User', //Name of the model from where data is populating
			select: 'email' //which all fields needs to be populated      
		};
		if (req.query.skip) {
			skipValue = req.query.skip;
		}
		if (req.query.role) {
			if (req.query.status == 'All') {
				query = {};
			} else {
				query = {
					status: "pending"
				};
			}
		}

		Article.find(query, {}, {
				limit: limitvalue,
				skip: skipValue,
				sort: {
					createdDate: -1
				}
			})
			.populate(populater)
			.exec(function (err, articles) {
				if (err) {
					res.json(err);

				} else {
					Article.count(query, function (err, result) {
						if (err) {
							res.json(err);
						} else {
							var articleData = {
								article: articles,
								count: result
							};
							res.json(articleData);
						}
					});
				}
			});
	}

	//function to fetch article based on articleId and increase view Count
	function fetchArticle(req, res, next) {

		if (req.query.articleId) {

			var populater = {
				path: 'user', //field to which data is populated
				model: 'User', //Name of the model from where data is populating
				select: 'email' //which all fields needs to be populated      
			}
			Article.findByIdAndUpdate({
					_id: req.query.articleId
				}, {
					$inc: {
						viewCount: req.query.viewAdd
					}
				})
				.exec(function (err, updates) {
					if (err) {
						res.json(err);
					} else {
						Article.find({
								_id: req.query.articleId
							})
							.populate(populater)
							.exec(function (err, articles) {
								if (err) {
									res.json(err);

								} else {
									res.json(articles);
								}
							});
					}

				});
		} else {
			res.end();
		}

	}

	//Function to fetch all articles associated to a tab
	function fetchTagArticle(req, res, next) {


		if (req.query.tagName && req.query.tagSkip) {
			console.log("Requested Tag:" + req.query.tagName);

			var populater = {
				path: 'user', //field to which data is populated
				model: 'User', //Name of the model from where data is populating
				select: 'email' //which all fields needs to be populated      
			}

			Article.find({
					tags: req.query.tagName,
					status: "active"
				}, {}, {
					limit: 10,
					skip: req.query.tagSkip,
					sort: {
						createdDate: -1
					}
				})
				.populate(populater)
				.exec(function (err, articles) {
					if (err) {
						res.json(err);

					} else {
						Article.count({
							tags: req.query.tagName,
							status: "active"
						}, function (err, result) {
							if (err) {
								res.json(err);
							} else {
								var articleData = {
									article: articles,
									count: result
								};
								res.json(articleData);
							}
						});
					}
				});
		} else {
			res.end();
		}
	}

	//Function to remove articles based on articleId
	function removeArticle(req, res, next) {

		if (req.query.articleId) {
			Article.findByIdAndRemove(req.query.articleId, function (err, result) {
				if (err) {
					res.json(err);
				} else {
					console.log("Deleted:" + req.query.articleId);
					Comment.remove({
						article: req.query.articleId
					}, function (err, delStatus) {
						if (err) {
							console.log("Related Comment Deletion: Failed");
						} else {
							console.log("Related Comment Deletion: Success");
						}
					});
					res.json(result);
				}
			});
		}

	}

	//Function to Fetch 3 articles: << which has most viewcount >> and << posted latest >> 
	function fetchLatestInfo(req, res, next) {
		console.log("Latest Info fetch");
		if (req.query.latestInfo) {

			Article.find({
				status: 'active'
			}, {}, {
				limit: 3,
				skip: 0,
				sort: {
					createdDate: -1
				}
			}).exec(function (err, recent) {

				if (err) {
					res.json(err);
				} else {
					Article.find({}, {}, {
						limit: 3,
						skip: 0,
						sort: {
							viewCount: -1
						}
					}).exec(function (err, mostViewed) {
						if (err) {
							res.json(err);
						} else {
							res.json({
								latest: recent,
								mostViewed: mostViewed
							});
						}
					});
				}
			});
		}
	}

}
