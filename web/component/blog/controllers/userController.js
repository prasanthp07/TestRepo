//**************************** User Controller defenition**************************************
(function () {
	'use strict';

	mainApp.controller('userController', userController);

	userController.inject = ['$window', '$rootScope', 'userFactory'];

	function userController($window, $rootScope, userFactory) {

		var vm = this;
		vm.User = {};
		vm.message = "";
		$rootScope.userId = '';
		$window.localStorage.setItem('user', '');
		vm.addUser = addUser;
		vm.checkUser = checkUser;

		//function to add a new user to blog
		function addUser() {
			vm.message = "";
			if (vm.User.password === vm.confPassword) {

				var reply = userFactory.addNewUser(vm.User);
				reply.then(function (res) {
					if (res.data == "User Registration Done") {
						$window.location.href = "#/login";
					} else {
						vm.message = res.data;
					}
				});
			} else {
				vm.message = "Password Not Matched!";
			}
		}

		//function to authenticate user
		function checkUser() {
			var reply = userFactory.authenticateUser(vm.User);
			reply.then(function (res) {
				if (res.data.msg) {
					$rootScope.mail = vm.User.email;
					$rootScope.userId = res.data.user._id;
					$window.localStorage.setItem('user', res.data.user._id);
					$window.localStorage.setItem('mail', vm.User.email);
					$window.location.href = "#/home";
				} else {
					vm.message = res.data;
				}
			});
		}

	}

})();
