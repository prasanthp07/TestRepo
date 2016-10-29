/*************************************Article Factory Defenition******************************/

(function () {
	'use strict';

	mainApp.factory('articleFactory', articleFactory);

	//Dependency Injection
	articleFactory.inject = ['$http'];

	//Defenition
	function articleFactory($http) {

		var result = {
			//function declerations
			getArticles: getArticles,
			getArticle: getArticle,
			getTagArticles: getTagArticles,
			removeArticle: removeArticle,
			updateArticle: updateArticle,
			postComment: postComment,
			getComments: getComments,
			getLatestInfo: getLatestInfo

		};


		/*
		 * Defenition:Function to fetch multiple Article details from server
		 * @param1: skip=how many values need to skip
		 * @param2: userId= Id of the user 
		 * */
		function getArticles(skip, userId) {
			return $http.get('http://localhost:4000/articles?skip=' + skip + '&userId=' + userId).success(function (res) {

				return res;
			});
		}

		/*
		 * Defenition:Function to fetch Article details from server
		 * @param1: articleId=Id of the Article
		 * @param2: viewAdd= increment value for ViewCount 
		 * */
		function getArticle(articleId, viewAdd) {
			return $http.get('http://localhost:4000/articles?articleId=' + articleId + '&viewAdd=' + viewAdd).success(function (res) {
				return res;
			});
		}


		/*
		 * Defenition:Function to fetch multiple Article details from server
		 * @param1: tagSkip=how many values need to skip
		 * @param2: tagName 
		 * */
		function getTagArticles(tagSkip, tagName) {

			return $http.get('http://localhost:4000/articles?tagSkip=' + tagSkip + '&tagName=' + tagName).success(function (res) {

				return res;
			});
		}

		//function to remove an article based on articleId
		function removeArticle(articleId) {
			return $http.delete('http://localhost:4000/articles?articleId=' + articleId).success(function (res) {
				return res;
			});
		}

		//function to update Article details where article deatil is parameter
		function updateArticle(article) {
			return $http.put('http://localhost:4000/articles', article).success(function (res) {
				return res;
			});

		}

		//function to post a comment to an article
		function postComment(comment) {
			return $http.post('http://localhost:4000/comments', comment).success(function (res) {
				return res;
			});
		}

		//function to get the comments of an article based on articleId
		function getComments(articleId) {
			return $http.get('http://localhost:4000/comments?articleId=' + articleId).success(function (res) {
				return res;
			});
		}

		//function to get the Top 3 articles based on ViewCount and Most recently posted
		function getLatestInfo() {
			return $http.get('http://localhost:4000/articles?latestInfo=true').success(function (res) {
				return res;
			});
		}

		return result;
	}

})();
