(function () {
	'use strict';

	adminApp.factory('adminFactory', adminFactory);

	adminFactory.inject = ['$http'];

	function adminFactory($http) {

		var result = {
			getArticles: getArticles,
			removeArticle: removeArticle,
			updateStatus: updateStatus
		}

		function getArticles(skip, status) {
			return $http.get('http://localhost:4000/articles/admin?skip=' + skip + '&role=admin&status=' + status).success(function (res) {

				return res;
			});
		}

		function removeArticle(articleId) {
			return $http.delete('http://localhost:4000/articles/admin?articleId=' + articleId + '&role=admin').success(function (res) {
				return res;
			});
		}

		function updateStatus(articleId, status) {
			console.log("admin");
			return $http.put('http://localhost:4000/articles/admin?articleId=' + articleId + '&status=' + status).success(function (res) {
				return res;
			});
		}

		return result;

	}
})();
