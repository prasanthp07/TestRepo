//********************Service for File Uploading***************** 

(function () {

	'use strict';
	mainApp.service('fileUploadService', fileUploadService);
	fileUploadService.$inject = ['$http', '$window'];

	function fileUploadService($http, $window) {

		//function to upload file to the url(arguments form data and url)
		this.uploadFileToUrl = function (data, uploadUrl) {
			var fd = new FormData();
			for (var key in data)
				fd.append(key, data[key]);
			$http.post(uploadUrl, fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			}).success(function (resp) {
				alert("Data Saved Succesfully");
				$window.location.href = "#/home";
			});
		}
	}

})();
