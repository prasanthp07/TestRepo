//******************************* Article Controller *****************************************

(function () {
	'use strict';

	mainApp.controller('articleController', articleController);

	articleController.inject = ['$window', '$rootScope', '$routeParams', 'articleFactory'];

	function articleController($window, $rootScope, $routeParams, articleFactory) {

		//variable declerations
		var vm = this;
		vm.article = {};
		vm.Comments = [];
		vm.topViews = [];
		vm.recent = [];
		vm.imgVisible = false;
		vm.loadArticle = loadArticle;
		vm.postComment = postComment;
		vm.getComments = getComments;
		vm.getTopInfo = getTopInfo;
		vm.logoff = logoff;
		//default values for user who are not loggedIn
		vm.userId = "57332fb696f8936f472af197";
		vm.mail = "Anonymous@blog";

		//function call
		getTopInfo();

		//checking if a user is logged in
		if ($rootScope.userId || $window.localStorage.getItem('user')) {
			if (!$rootScope.userId) {
				$rootScope.userId = $window.localStorage.getItem('user');
			}
			vm.mail = $window.localStorage.getItem('mail');
			vm.userId = $rootScope.userId;
			vm.loggedUser = $rootScope.userId;
			vm.login = true;
			vm.logout = false;
		} else {
			vm.logout = true;
			vm.login = false;
			$window.localStorage.setItem('mail', 'Anonymous@blog');
		}

		//checking if article is already viewed
		if ($routeParams.articleId) {
			if ($window.localStorage.getItem($routeParams.articleId)) {
				vm.increment = 0;
			} else {
				$window.localStorage.setItem($routeParams.articleId, true);
				vm.increment = 1;
			}
			loadArticle();
		}


		//function to load article
		function loadArticle() {
			var reply = articleFactory.getArticle($routeParams.articleId, vm.increment);
			reply.then(function (res) {

				if (res.data) {
					vm.article = res.data[0];
					if (vm.article.type === "Text") {
						vm.imgVisible = false;
					} else {
						vm.imgVisible = true;
					}
					//console.log(res.data[0]);
					vm.getComments();

				} else {
					console.log("Failed to load data");
				}
			});

		}

		//function to post a comment to the article
		function postComment() {

			//creating comment Object for passing
			var Comment = {
				text: vm.comment,
				article: vm.article._id,
				user: vm.userId
			};

			//post request only if comment is present in comment field 
			if (vm.comment.length > 0) {
				var reply = articleFactory.postComment(Comment);
				reply.then(function (response) {
					if (response.data) {
						vm.article.commentCount += 1;
						vm.comment = "";
						getComments();
						//console.log(response.data);
					} else {
						console.log("Error in posting comment")
					}
				});
			}
		}

		//function to get the comments of an article
		function getComments() {
			var reply = articleFactory.getComments(vm.article._id);
			reply.then(function (response) {
				if (response.data) {
					vm.Comments = response.data;
				}
			});
		}

		//function to get 3 most viewed and recently posted articles 
		function getTopInfo() {
			var reply = articleFactory.getLatestInfo();
			reply.then(function (response) {
				if (response.data.mostViewed && response.data.latest) {
					vm.topViews = response.data.mostViewed;
					vm.recent = response.data.latest;
				}
			});
		}

		//function to clear stored user credentials 		
		function logoff() {
			$rootScope.userId = "";
			vm.userId = "57332fb696f8936f472af197";
			$window.localStorage.setItem('user', '');
			$window.localStorage.setItem('mail', 'Anonymous@blog');
			vm.login = false;
			vm.logout = true;
			vm.mail = "Anonymous@blog";
		}
	}
})();
