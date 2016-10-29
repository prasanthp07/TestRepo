//********************************* Home controller defenition ********************************

(function () {
	'use strict';

	mainApp.controller('homeController', homeController);

	homeController.inject = ['$window', '$rootScope', '$routeParams', 'articleFactory'];

	function homeController($window, $rootScope, $routeParams, articleFactory) {

		//variable declerations
		var vm = this;
		vm.Articles = [];
		vm.topViews = [];
		vm.recent = [];
		vm.editPost = {};
		vm.currentPage = 1;
		vm.totalItem = 0;
		vm.skip = 0;
		vm.showEdit = false;
		vm.userId = $rootScope.userId;
		vm.mail = "Anonymous@blog";
		//function declerations
		vm.getNext = getNext;
		vm.loadArticles = loadArticles;
		vm.deleteArticle = deleteArticle;
		vm.editArticle = editArticle;
		vm.getTopInfo = getTopInfo;
		vm.updateArticle = updateArticle;
		vm.logoff = logoff;

		//checking whether user is logged-in
		if ($rootScope.userId || $window.localStorage.getItem('user')) {
			if (!$rootScope.userId) {
				$rootScope.userId = $window.localStorage.getItem('user');
				vm.userId = $rootScope.userId;
			}
			vm.mail = $window.localStorage.getItem('mail');
			vm.login = true;
			vm.logout = false;
		} else {
			vm.login = false;
			vm.logout = true;
			vm.showEdit = false;
			$window.localStorage.setItem('mail', 'Anonymous@blog');

		}
		getTopInfo();
		loadArticles();

		//function to get the next set of articles on Next button click
		function getNext() {
			vm.skip = (vm.currentPage - 1) * 10;
			vm.loadArticles();
		}

		//function to load articles: @params= {skip =>no of items to be skipped}
		function loadArticles() {

			if ($routeParams.userId) {
				var reply = articleFactory.getArticles(vm.skip, $routeParams.userId);
				if ($rootScope.userId) {
					vm.showEdit = true;
				}
			} else if ($routeParams.tagName) {
				var reply = articleFactory.getTagArticles(vm.skip, $routeParams.tagName);
			} else {
				var reply = articleFactory.getArticles(vm.skip, '');
			}

			reply.then(function (res) {
				if (res.data.count) {
					vm.Articles = res.data.article;
					vm.totalItems = res.data.count;
				} else {
					console.log('@' + res.data);
				}
			});
		}

		//function to delete article based on articleId
		function deleteArticle(articleId) {
			if ($window.confirm("Confirm deletion !!!")) {
				var reply = articleFactory.removeArticle(articleId);
				reply.then(function (response) {
					if (response.data) {
						alert("Article removed");
						vm.loadArticles();
					} else {
						alert("Error");
					}
				});
			}
		}

		//function to select the article to edit
		function editArticle(article) {
			vm.editPost = article;
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

		//function to update the article details 
		function updateArticle() {
			console.log(vm.editPost.tags);
			var reply = articleFactory.updateArticle(vm.editPost);
			reply.then(function (response) {
				console.log(response.data);
			});
		}

		//function to clear stored user credentials
		function logoff() {
			$rootScope.userId = "";
			$window.localStorage.setItem('user', '');
			$window.localStorage.setItem('mail', 'Anonymous@blog');
			vm.mail = "Anonymous@blog";
			vm.login = false;
			vm.logout = true;
		}
	}

})();
