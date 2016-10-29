//**********************************Administrator  app 'adminApp' ****************************** 

var adminApp;
(function () {

	"use strict;"
	adminApp = angular
		.module('adminApp', ['ngRoute', 'ui.bootstrap']);

	adminApp.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.
		when('/admin', {
			templateUrl: '/admin/views/login.html',
			controller: 'adminController',
			controllerAs: 'admin'
		}).
		when('/adminHome', {
			templateUrl: '/admin/views/admin.html',
			controller: 'adminController',
			controllerAs: 'admin'
		}).
		otherwise({
			redirectTo: '/admin'
		});
	}]);
})();
