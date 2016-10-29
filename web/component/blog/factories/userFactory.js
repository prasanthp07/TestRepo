/********************************** UserFactory Defentition **********************************/

(function () {
	'use strict';

	mainApp.factory('userFactory', userFactory);

	//Dependency Injection
	userFactory.inject = ['$http'];

	//Defenition
	function userFactory($http) {

		var result = {
			authenticateUser: authenticateUser,
			addNewUser: addNewUser
		};

		/*
		 * Defenition:Function to post a request to the server
		 * @param1: User = user details
		 * @param2: type = request type 'login' or 'register'
		 * */
		function postRequest(User, type) {
			var user = {
				'email': User.email,
				'password': User.password
			};
			return $http.post('http://localhost:4000/user?type=' + type, user).success(function (res) {
				return res;
			});
		}
		//function to authenticate the user with user details(email,password)  
		function authenticateUser(User) {
			return postRequest(User, 'login');
		}

		//function to register a new user with user details (email,password)
		function addNewUser(User) {
			return postRequest(User, 'register');

		}
		return result;
	}

})();
