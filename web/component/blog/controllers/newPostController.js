//***************************** Dashboard Controller Defenition*******************************

(function () {
	'use strict';

	mainApp.controller('newPostController', newPostController);

	newPostController.inject = ['$window', '$rootScope', 'fileUploadService'];

	function newPostController($window, $rootScope, fileUploadService) {

		//Variable declerations
		var vm = this;
		vm.imgDisable = false;
		vm.contentRequired = false;
		vm.imgRequired = true;
		vm.post = {};
		vm.post.type = "Image";
		vm.post.tags = [];
		vm.addedTag = "";
		//default value of user who didnt logged in
		vm.post.user = "57332fb696f8936f472af197";
		vm.mail = "Anonymous@blog";

		//function declerations
		vm.addTag = addTag;
		vm.logoff = logoff;
		vm.setPost = setPost;
		vm.postArticle = postArticle;

		//checking if user is already logged in 
		if ($rootScope.userId || $window.localStorage.getItem('user')) {
			if (!$rootScope.userId) {
				$rootScope.userId = $window.localStorage.getItem('user');
			}
			vm.post.user = $rootScope.userId;
			vm.mail = $window.localStorage.getItem('mail');
			vm.login = true;
			vm.logout = false;
		} else {
			vm.login = false;
			vm.logout = true;
			$window.location.href = "#/home";
			$window.localStorage.setItem('mail', 'Anonymous@blog');
		}

		//setting which type of post(Text or Image Post)
		function setPost() {
			if (vm.post.type === "Image") {
				vm.imgDisable = false;
				vm.contentRequired = false;
				vm.imgRequired = true;
			} else {
				vm.imgDisable = true;
				vm.imgRequired = false;
				vm.contentRequired = true;
			}
		}

		//Adding tags for the article
		function addTag() {
			if (vm.tagName) {
				vm.post.tags.push(vm.tagName.trim());
				vm.addedTag += vm.tagName.trim() + "\n";
			}
		}

		//function to post an article in the blog
		function postArticle() {

			if (vm.imgRequired) {
				if (vm.post.image) {
					var filename = vm.post.image.name
					var file = [];
					file = filename.split('.');
					if (file.length > 1 && (file[file.length - 1] == 'jpg' || file[file.length - 1] == 'png')) {
						fileUploadService.uploadFileToUrl(vm.post, 'http://127.0.0.1:4000/articles');
					} else {
						alert("Please upload any JPG or PNG files");
					}
				} else {
					alert("Please select file");
				}
			} else {
				fileUploadService.uploadFileToUrl(vm.post, 'http://127.0.0.1:4000/articles');
			}
		}

		//function to clear stored user credentials
		function logoff() {
			$rootScope.userId = "";
			$window.localStorage.setItem('user', '');
			$window.localStorage.setItem('mail', 'Anonymous@blog');
			vm.login = false;
			vm.logout = true;
			vm.mail = "Anonymous@blog";
		}

	}

})();
