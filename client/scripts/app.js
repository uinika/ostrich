'use strict';
/* Bootstrap Application */
var app = angular.module('app', [
  'Config',
  'ui.router',
  'ui.bootstrap',
  'treeControl',
  'isteven-multi-select',
  'Login',
  'Main',
  'Dashboard',
  'Admin',
  'Admin.User',
  'Admin.Department',
  'Department',
  'DataQuota',
  'DataQuotaList',
  'DataQuotaDetail',
  'Department.Inventory',
  'Department.Audit',
  'Department.Requirement',
  'DepartmentShare'
]);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$provide',
  function($stateProvider, $urlRouterProvider, $httpProvider, $provide) {
    /** HTTP Interceptor */
    $httpProvider.interceptors.push(['$q',
      function($q) {
        return {
          'request': function(config) {
            config.withCredentials = true;
            return config;
          },
          'requestError': function(rejection) {
            return rejection;
          },
          'response': function(response) {
            $q.when(response, function(result){
              if( response.data && typeof response.data==='object'){
                if(result.data.head.status===300){
                  sessionStorage.message = '登录超时，请重新登陆！';
                  window.location.href='/build';
                };
              };
            });
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
      .state('main.admin', {
        url: '/admin',
        templateUrl: 'views/admin/main.html',
        controller: 'Admin.Controller.Main'
      })
      .state('main.admin.department', {
        url: '/dashboard',
        templateUrl: 'views/admin/department.html',
        controller: 'Admin.Department.Controller.Main'
      })
      .state('main.admin.user', {
        url: '/user',
        templateUrl: 'views/admin/user.html',
        controller: 'Admin.User.Controller.Main'
      })
      .state('main.data-quota', {
        url: '/data-quota',
        templateUrl: 'views/data-quota/main.html',
        controller: 'DataQuota.Controller.Main'
      })
      .state('main.data-quota.list', {
        url: '/list/:resource_dep_id/:dep_name',
        templateUrl: 'views/data-quota/list.html',
        controller: 'DataQuotaList.Controller.Main'
      })
      .state('main.data-quota.detail', {
        url: '/detail/:resource_id',
        templateUrl: 'views/data-quota/detail.html',
        controller: 'DataQuotaDetail.Controller.Main'
      })
      .state('main.department', {
        url: '/department',
        templateUrl: 'views/department/main.html'
      })
      .state('main.department.summary', {
        url: '/summary',
        cache:'false',
        reload: true,
        templateUrl: 'views/department/summary.html',
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
      .state('main.department.inventory.update', {
        url: '/update/:item',
        templateUrl: 'views/department/inventory-update.html',
        controller: 'Department.Inventory.Controller.publish'
      })
      .state('main.department.detail', {
        url: '/detail/:item',
        cache:'false',
        templateUrl: 'views/department/inventory-detail.html',
        controller: 'Department.Inventory.Controller.detail'
      })
      .state('main.department.share', {
        url: '/share',
        templateUrl: 'views/department/share.html',
        controller: 'DepartmentShare.Controller.Main'
      })
      .state('main.department.share.detail', {
        url: '/detail/:item',
        templateUrl: 'views/department/share-detail.html',
        controller: 'DepartmentShare.Controller.detail'
      })
      .state('main.department.requirementConfirm', {
        url: '/requirement-confirm',
        templateUrl: 'views/department/requirement-confirm.html',
        controller: 'Department.Requirement.Controller.confirm'
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
        url: '/info/:AUDITID/:RESOURCEID/:APPLYTIME/:APPLYDEP',
        templateUrl: 'views/department/audit-info.html',
        controller: 'Department.Audit.Controller.info'
      })

  }
]);

app.run(['$rootScope', function($rootScope){
  $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams){
      if(toState.name!=='login'){
        if(!sessionStorage.token){
          window.location.href='/build';
        };
      };
    });
}]);
