'use strict';
/* Bootstrap Application */
var app = angular.module('app', [
  'Config',
  'ui.router',
  'ui.bootstrap',
  'isteven-multi-select',
  'Login',
  'Main',
  'Dashboard',
  'Department',
  'Inventory',
  'InventoryDetail',
  'Department.Inventory',
  'Department.Audit',
  'Department.SystemUser',
  'Department.Requirement',
  'RequirementMain',
  'RequirementDetail',
  'DepartmentShare'
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
        templateUrl: 'views/inventory/main.html',
        controller: 'Inventory.Controller.Main'
      })
      .state('main.inventory.list', {
        url: '/list',
        templateUrl: 'views/inventory/list.html',
        controller: 'Inventory.Controller.Main'
      })
      .state('main.inventory.detail', {
        url: '/detail/:inventoryID',
        templateUrl: 'views/inventory/detail.html',
        controller: 'InventoryDetail.Controller.Main'
      })
      .state('main.requirement', {
        url: '/requirement',
        templateUrl: 'views/requirement/main.html',
        controller: 'RequirementMain.Controller.Main'
      })
      .state('main.requirement.detail', {
        url: '/detail/:requirementID',
        templateUrl: 'views/requirement/detail.html',
        controller: 'RequirementDetail.Controller.Main'
      })
      .state('main.department', {
        url: '/department',
        templateUrl: 'views/department/main.html',
        controller: 'Department.Controller.Main'
      })
      .state('main.department.inventory', {
        url: '/inventory',
        cache:'false',
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
        templateUrl: 'views/department/share.html',
        controller: 'DepartmentShare.Controller.Main'
      })
      .state('main.department.requirement', {
        url: '/requirement',
        templateUrl: 'views/department/requirement.html',
        controller: 'Department.Requirement.Controller.Main'
      })
      .state('main.department.requirement.publish', {
        url: '/publish',
        templateUrl: 'views/department/requirement-publish.html'
      })
      .state('main.department.requirement.detail', {
        url: '/detail?ID',
        templateUrl: 'views/department/requirement-detail.html',
        controller: 'Department.Requirement.Controller.detail'
      })
      .state('main.department.audit', {
        url: '/audit',
        cache:'false',
        templateUrl: 'views/department/audit.html',
        controller: 'Department.Audit.Controller.Main'
      })
      .state('main.department.audit.info', {
        url: '/info?AUDITID',
        templateUrl: 'views/department/audit-info.html',
        controller: 'Department.Audit.Controller.info'
      })
      .state('main.department.user', {
        url: '/user',
        templateUrl: 'views/department/user.html',
        controller: 'Department.SystemUser.Controller.Main'
      })
  }
]);
