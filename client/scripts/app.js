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
        templateUrl: 'views/main.html',
        controller: 'Main.Controller.Main'
      })
      .state('main', {
        url: '/main',
        templateUrl: 'views/inventory/main.html',
        controller: 'Inventory.Controller.Main'
      })
      .state('main', {
        url: '/main',
        templateUrl: 'views/department/main.html',
        controller: 'Department.Controller.Main'
      })
      .state('main', {
        url: '/main',
        templateUrl: 'views/requirement/main.html',
        controller: 'Requirement.Controller.Main'
      })
  }
]);
