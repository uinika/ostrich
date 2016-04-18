'use strict';
/* Bootstrap Application */
var app = angular.module('app', [
  'Config',
  'ui.router',
  'ui.bootstrap',
  'Login',
  'Main',
  'Dashboard',
  'Department',
  'Department.Inventory',
  'Department.Audit',
  'Department.SystemUser'
]);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$provide',
  function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $provide) {
    /** URL Location Mode */
    $locationProvider.html5Mode(false);
    /** HTTP Interceptor */
    $httpProvider.interceptors.push(['$q',
      function($q) {
        return {
          'request': function(config) {
            config.withCredentials = true;
            return config;
          },
          'requestError': function(rejection) {
            return response;
          },
          'response': function(response) {
            return response;
          },
          'responseError': function(rejection) {
            return rejection;
          }
        };
      }
    ]);
    /** Config Router */
    $urlRouterProvider.otherwise('/login');
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/common/login.html',
        controller: 'Login.Controller.Main'
      })
      .state('main', {
        url: '/main',
        templateUrl: 'views/common/main.html',
        controller: 'Main.Controller.Main'
      })
      .state('main.dashboard', {
        url: '/dashboard',
        templateUrl: 'views/common/dashboard.html',
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
        templateUrl: 'views/department/main.html',
        controller: 'Department.Controller.Main'
      })
      .state('main.department.inventory', {
        url: '/inventory',
        templateUrl: 'views/department/inventory.html',
        controller: 'Department.Inventory.Controller.Main'
      })
      .state('main.department.inventory.publish', {
        url: '/publish',
        templateUrl: 'views/department/inventory-publish.html',
        controller: 'Department.Inventory.Controller.publish'
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
        templateUrl: 'views/department/audit.html',
        controller: 'Department.Audit.Controller.Main'
      })
      .state('main.department.audit.info', {
        url: '/info',
        templateUrl: 'views/department/audit-info.html'
      })
      .state('main.department.user', {
        url: '/user',
        templateUrl: 'views/department/user.html',
        controller: 'Department.SystemUser.Controller.Main'
      })
  }
]);
