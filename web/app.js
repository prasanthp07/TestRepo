//************************************* App file for blog *****************************
var mainApp;
(function () {

	"use strict;"
	//dependency injection
	mainApp = angular
		.module('mainApp', ['ngRoute',
							'ui.bootstrap',
							'ngSanitize'
						   ]);

	//Defining Config for mainApp
	mainApp.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: '/web/component/blog/views/home.html',
			controller: 'homeController',
			controllerAs: 'home'
		}).
		when('/home', {
			templateUrl: '/web/component/blog/views/home.html',
			controller: 'homeController',
			controllerAs: 'home'
		}).
		when('/home/:userId', {
			templateUrl: '/web/component/blog/views/home.html',
			controller: 'homeController',
			controllerAs: 'home'
		}).
		when('/articles/:articleId', {
			templateUrl: '/web/component/blog/views/article.html',
			controller: 'articleController',
			controllerAs: 'art'
		}).
		when('/articles/tags/:tagName', {
			templateUrl: '/web/component/blog/views/home.html',
			controller: 'homeController',
			controllerAs: 'home'
		}).
		when('/login', {
			templateUrl: '/web/component/blog/views/login.html',
			controller: 'userController',
			controllerAs: 'user'
		}).
		when('/register', {
			templateUrl: '/web/component/blog/views/register.html',
			controller: 'userController',
			controllerAs: 'user'
		}).
		when('/new', {
			templateUrl: '/web/component/blog/views/newPost.html',
			controller: 'newPostController',
			controllerAs: 'np'
		}).
		otherwise({
			redirectTo: '/'
		});
        }]);
})();
