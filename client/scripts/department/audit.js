'use strict';
var Audit = angular.module('Department.Audit', ['ui.router']);

/** Main Controller */
Audit.controller('Department.Audit.Controller.Main', ['$scope', '$q','Department.Audit.Service.Http',
  function($scope, $q ,Http) {
    var _httpParams = {};

    Http.getAuditTotal().then(function(result) {
      $scope.auditTotal = result.data.body[0].auditTotal;
    });

    Http.getShareLevelFilter().then(function(result) {
      $scope.shareLevelList = result.data.body;
    });

    Http.getAreaPeriodFilter().then(function(result) {
      $scope.areaPeriodList = result.data.body;
    });

    Http.getAuditStatusFilter().then(function(result) {
      $scope.auditStatusList = result.data.body;
    });

    function getAuditList(_httpParams) {
      Http.getAuditList(_httpParams).then(function(result){
        console.log(result.data.body);
        $scope.auditList = result.data.body;
      //  $scope.Paging.totalItems = data.head.total;
      });
    }

    // Http.getResponseList({
    //   skip: 0,
    //   limit: 6
    // }).then(function(result) {
    //   $scope.responseList = result.data.body;
    //   $scope.responseTotal = result.data.head.total;
    // })

    $scope.getAuListBySl = function(ev) {
      _httpParams.shareLevel = ev.ID;
      getAuditList(_httpParams);
    }
  }
])


/* HTTP */
Department.factory('Department.Audit.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function getAuditTotal() {
      return $http.get(
        path + '/audit'
      )
    };

    function getShareLevelFilter() {
      return $http.get(
        path + '/audit/shareLevelFilter'
      )
    }

    function getAreaPeriodFilter() {
      return $http.get(
        path + '/audit/areaPeriodFilter'
      )
    }

    function getAuditStatusFilter() {
      return $http.get(
        path + '/audit/auditStatusFilter'
      )
    }

    function getAuditList(params) {
      return $http.get(
        path + '/audit/auditList', {
          params:params
        }
      )
    }
    return {
      getAuditTotal: getAuditTotal,
      getShareLevelFilter: getShareLevelFilter,
      getAreaPeriodFilter: getAreaPeriodFilter,
      getAuditStatusFilter: getAuditStatusFilter,
      getAuditList: getAuditList
    }
  }
]);
