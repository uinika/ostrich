'use strict';
/* Bootstrap Application */

var app = angular.module('app', [
  'Config',
  'ui.router',
  'ngMaterial',
  'md.data.table',
  'ui.bootstrap',
  'LoginController',
  'Main',
  'DashboardController',
  'ResourceCatalog',
  'DataResource',
  'DataInfo',
  'DataAuthority',
  'DataAuthorityApply',
  'DataAuditInfo',
  'DataReleaseInfo',
  'DataOfflineInfo',
  'DataVisitInfo',
  'ServerManage',
  'ContactsGroup',
  'AlarmRule',
  'AlarmInfo',
  'DcmConfig',
  'SysSettingCategory',
  'SysDictCategory',
  'LogManage',
  'InitSystemController',
  'SysDepManage',
  'UserManage',
  'SysRole',
  'DataRole',
  'PlatStatisticController',
  'PlatDeptStatisticController',
  'DataVisitStatisticController'
]);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$mdThemingProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider) {
    $locationProvider.html5Mode(false);
    $urlRouterProvider.otherwise('/login');
    /** Config Material Theme */
    $mdThemingProvider.theme('default')
      .primaryPalette('teal')
      .accentPalette('orange');
    /** Config UI Router */
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'partials/common/login.html',
        controller: 'LoginController.login'
      })
      .state('main', {
        url: '/main',
        templateUrl: 'partials/common/main.html',
        controller: 'Main.Controller.Main'
      })
      .state('main.dashboard', {
        url: '/dashboard',
        templateUrl: 'partials/dashboard/dashboard.html',
        controller: 'DashboardController.dashboard'
      })
      .state('main.resource-catalog', {
        url: '/resource-catalog',
        templateUrl: 'partials/data-resource/resource-catalog/resource-catalog.html',
        controller: 'ResourceCatalog.Controller.Main'
      })
      .state('main.data-resource', {
        url: '/data-resource',
        templateUrl: 'partials/data-resource/metadata/data-resource.html',
        controller: 'DataResource.Controller.dataResource'
      })
      .state('main.data-info', {
        url: '/data-info',
        templateUrl: 'partials/data-resource/metadata/data-info.html',
        controller: 'DataInfo.Controller.dataInfo'
      })
      .state('main.data-authority', {
        url: '/data-authority',
        templateUrl: 'partials/data-resource/metadata/data-authority.html',
        controller: 'DataAuthority.Controller.dataAuthority'
      })
      .state('main.data-authority-apply', {
        url: '/data-authority-apply',
        templateUrl: 'partials/data-resource/metadata/data-authority-apply.html',
        controller: 'DataAuthorityApply.Controller.dataAuthorityApply'
      })
      .state('main.data-audit-info', {
        url: '/data-audit-info',
        templateUrl: 'partials/data-resource/data/data-audit-info.html',
        controller: 'DataAuditInfo.Controller.dataAuditInfo'
      })
      .state('main.data-release-info', {
        url: '/data-release-info',
        templateUrl: 'partials/data-resource/data/data-release-info.html',
        controller: 'DataReleaseInfo.Controller.dataReleaseInfo'
      })
      .state('main.data-offline-info', {
        url: '/data-offline-info',
        templateUrl: 'partials/data-resource/data/data-offline-info.html',
        controller: 'DataOfflineInfo.Controller.dataOfflineInfo'
      })
      .state('main.data-visit-info', {
        url: '/data-visit-info',
        templateUrl: 'partials/data-status/data-visit-info.html',
        controller: 'DataVisitInfo.Controller.dataVisitInfo'
      })
      .state('main.plat-statistic', {
        url: '/plat-statistic',
        templateUrl: 'partials/data-status/plat-statistic.html',
        controller: 'PlatStatisticController.platStatistic'
      })
      .state('main.plat-dept-statistic', {
        url: '/plat-dept-statistic',
        templateUrl: 'partials/data-status/plat-dept-statistic.html',
        controller: 'PlatDeptStatisticController.platDeptStatistic'
      })
      .state('main.data-visit-statistic', {
        url: '/data-visit-statistic',
        templateUrl: 'partials/data-status/data-visit-statistic.html',
        controller: 'DataVisitStatisticController.dataVisitStatistic'
      })
      .state('main.server-manage', {
        url: '/server-manage',
        templateUrl: 'partials/platform-operations/server-manage.html',
        controller: 'ServerManage.Controller.serverManage'
      })
      .state('main.contacts-group', {
        url: '/contacts-group',
        templateUrl: 'partials/platform-operations/platform-alarm/contacts-group.html',
        controller: 'ContactsGroup.Controller.contactsGroup'
      })
      .state('main.alarm-rule', {
        url: '/alarm-rule',
        templateUrl: 'partials/platform-operations/platform-alarm/alarm-rule.html',
        controller: 'AlarmRule.Controller.alarmRule'
      })
      .state('main.alarm-info', {
        url: '/alarm-info',
        templateUrl: 'partials/platform-operations/platform-alarm/alarm-info.html',
        controller: 'AlarmInfo.Controller.alarmInfo'
      })
      .state('main.dcm-config', {
        url: '/dcm-config',
        templateUrl: 'partials/platform-configuration/dcm-config.html',
        controller: 'DcmConfig.Controller.dcmConfig'
      })
      .state('main.sys-setting-category', {
        url: '/sys-setting-category',
        templateUrl: 'partials/platform-configuration/sys-setting-category.html',
        controller: 'SysSettingCategory.Controller.sysSettingCategory'
      })
      .state('main.sys-dict-category', {
        url: '/sys-dict-category',
        templateUrl: 'partials/platform-configuration/sys-dict-category.html',
        controller: 'SysDictCategory.Controller.sysDictCategory'
      })
      .state('main.log-manage', {
        url: '/log-manage',
        templateUrl: 'partials/platform-configuration/log-manage.html',
        controller: 'LogManage.Controller.logManage'
      })
      .state('main.init-system', {
        url: '/init-system',
        templateUrl: 'partials/platform-configuration/init-system.html',
        controller: 'InitSystemController.initSystem'
      })
      .state('main.sys-dep-manage', {
        url: '/sys-dep-manage',
        templateUrl: 'partials/organization-person/sys-dep-manage.html',
        controller: 'SysDepManage.Controller.sysDepManage'
      })
      .state('main.user-manage', {
        url: '/user-manage',
        templateUrl: 'partials/organization-person/user-manage.html',
        controller: 'UserManage.Controller.userManage'
      })
      .state('main.sys-role', {
        url: '/sys-role',
        templateUrl: 'partials/organization-person/sys-role.html',
        controller: 'SysRole.Controller.sysRole'
      })
      .state('main.data-role', {
        url: '/data-role',
        templateUrl: 'partials/organization-person/data-role.html',
        controller: 'DataRole.Controller.dataRole'
      })

  }
]);
