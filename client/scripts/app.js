'use strict';
/* Bootstrap Application */
var app = angular.module('app', [
  'Config',
  'ui.router',
  'ui.bootstrap',
  'Login',
  'Main',
  'Dashboard'

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
      .state('main.dashboard', {
        url: '/dashboard',
        templateUrl: 'views/dashboard.html',
        controller: 'Dashboard.Controller.Main'
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
      .state('main.department.inventory.publish', {
        url: '/publish',
        templateUrl: 'views/department/inventory-publish.html'
      })
      .state('main.department.share', {
        url: '/share',
        templateUrl: 'views/department/share.html'
      })
      .state('main.department.requirement', {
        url: '/requirement',
        templateUrl: 'views/department/requirement.html'
      })
      .state('main.department.requirement.publish', {
        url: '/publish',
        templateUrl: 'views/department/requirement-publish.html'
      })
      .state('main.department.requirement.detail', {
        url: '/detail',
        templateUrl: 'views/department/requirement-detail.html'
      })
      .state('main.department.audit', {
        url: '/audit',
        templateUrl: 'views/department/audit.html'
      })
      .state('main.department.audit.info', {
        url: '/info',
        templateUrl: 'views/department/audit-info.html'
      })
      .state('main.department.user', {
        url: '/info',
        templateUrl: 'views/department/user.html'
      })
  }
]);
