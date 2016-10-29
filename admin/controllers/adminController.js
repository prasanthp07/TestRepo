//********************************* Admin Controller  *************************************** 

(function () {
	'use strict';

	adminApp.controller('adminController', adminController);
	adminController.$inject = ['$window', 'adminFactory'];

	function adminController($window, adminFactory) {
		var vm = this;

		vm.User = {};
		vm.Articles = [];
		vm.currentPage = 1;
		vm.nextIndex = 0;
		vm.status = 'All';
		vm.message = '';
		vm.validateAdmin = validateAdmin;
		vm.getArticles = getArticles;
		vm.deleteArticle = deleteArticle;
		vm.editArticle = editArticle;
		vm.updateStatus = updateStatus;
		vm.clear = clear;
		vm.getNext = getNext;
		vm.load = load;

		//function to load article details based on Status
		function load() {
			getArticles();
		}

		//if url #path is for admin login clear temporary data 
		if ($window.location.hash == "#/admin") {
			vm.clear();
		}

		//display articles only if admin is logged-in and avoid url back tracking
		if ($window.localStorage.getItem("role")) {
			if ($window.localStorage.getItem("role") == "admn") {
				vm.getArticles();
				vm.showLogout = true;
			} else {
				vm.clear();
				$window.location.href = "#/admin";
			}
		} else {
			$window.location.href = "#/admin";
		}

		//Function to validate Administrator Account
		function validateAdmin() {
			if (vm.User.email == "Admin@adm" && vm.User.password == "admin") {
				$window.localStorage.setItem("role", 'admn');
				$window.location.href = "#/adminHome";
			} else {
				vm.message = "Invalid Email or Password"
				vm.User.email = "";
				vm.User.password = "";
			}
		}

		//function get all articles
		function getArticles() {
			var reply = adminFactory.getArticles(vm.nextIndex, vm.status);
			reply.then(function (response) {
				if (response.data.count) {
					vm.Articles = response.data.article;
					vm.totalItems = response.data.count;
				}

			});
		}

		//function to delete an article 
		function deleteArticle(articleId) {
			if ($window.confirm("Confirm Delete !!")) {
				var reply = adminFactory.removeArticle(articleId);
				reply.then(function (response) {
					if (response.data) {
						console.log("Article Deleted")
						vm.getArticles();
					} else {
						console.log("Failed to delete Article")
					}
				});
			}
		}

		//function to select the article to edit
		function editArticle(article) {
			vm.Article = article;
		}

		//Function to update the status of the article
		function updateStatus(articleId, status) {
			var reply = adminFactory.updateStatus(articleId, status);
			reply.then(function (response) {
				if (response.data) {
					console.log('Article Status Updated');
					vm.getArticles();
				}
			});
		}

		//function to get the next set of values to the table for pagination 
		function getNext() {
			vm.nextIndex = (vm.currentPage - 1) * 10;
			vm.getArticles();
		}

		//function to clear localstorage
		function clear() {
			$window.localStorage.setItem("role", '');
		}
	}
})();
