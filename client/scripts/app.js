'use strict';
/* Bootstrap Application */
var app = angular.module('app', [
  'Config',
  'ui.router',
  'ui.bootstrap',
  'Login'
]);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    /** URL Location Mode */
    $locationProvider.html5Mode(false);
    /** Config Router */
    $urlRouterProvider.otherwise('/login');
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'Login.Controller.Main'
      })
      .state('main', {
        url: '/main',
        templateUrl: 'views/main.html'
      })
      .state('main.dashboard', {
        url: '/dashboard',
        templateUrl: 'views/dashboard.html'
      })
      .state('main.inventory', {
        url: '/inventory',
        templateUrl: 'views/inventory/main.html'
      })
      .state('main.inventory.detail', {
        url: '/detail',
        templateUrl: 'views/inventory/detail.html'
      })
      .state('main.requirement', {
        url: '/requirement',
        templateUrl: 'views/requirement/main.html'
      })
      .state('main.requirement.detail', {
        url: '/detail',
        templateUrl: 'views/requirement/detail.html'
      })
      .state('main.department', {
        url: '/department',
        templateUrl: 'views/department/main.html'
      })
      .state('main.department.inventory', {
        url: '/inventory',
        templateUrl: 'views/department/inventory.html'
      })
  }
]);
