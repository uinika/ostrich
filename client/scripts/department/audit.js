'use strict';
var Audit = angular.module('Department.Audit', ['ui.router']);

/** Main Controller */
Audit.controller('Department.Audit.Controller.Main', ['$scope', '$q','Department.Audit.Service.Http',
  function($scope, $q ,Http) {
    var _httpParams = {};
    var depId = 1;

    Http.getAuditTotal({
      "DEP_ID":depId
    }).then(function(result) {
      $scope.auditTotal = result.data.body[0].NUMBER;
    });

    Http.getShareLevelFilter({
      "DEP_ID":depId
    }).then(function(result) {
      $scope.shareLevelList = result.data.body;
    });

    Http.getSpatialFilter({
      "DEP_ID":depId
    }).then(function(result) {
      $scope.areaPeriodList = result.data.body;
    });

    Http.getAuditStatusFilter({
      "DEP_ID":depId
    }).then(function(result) {
      $scope.auditStatusList = result.data.body;
    });

    function getAuditList(_httpParams) {
      Http.getAuditList(_httpParams).then(function(result){
        $scope.auditList = result.data.body;
      //  $scope.Paging.totalItems = data.head.total;
      });
    }

    // filter by share level
    $scope.shareLvSelection = [];
    $scope.getAuListBySl = function(item) {
      var idx = $scope.shareLvSelection.indexOf(item.DICTID);
      if (idx > -1) {
        $scope.shareLvSelection.splice(idx, 1);
      }
      else {
        $scope.shareLvSelection = item.DICTID;
      }
      _httpParams.shareLevel = item.DICTID;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getAuditList(_httpParams);
    }

    // filter by partial
    $scope.areaSelection = [];
    $scope.getAuListByAP = function(item) {
      var idx = $scope.areaSelection.indexOf(item.DICTID);
      // is currently selected
      if (idx > -1) {
        $scope.areaSelection.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.areaSelection.push(item.DICTID);
      }
      console.log($scope.areaSelection);
      _.forEach($scope.areaSelection,function(value){
        _httpParams.DICT_ID = value;
      })
      _httpParams.spatial = item.DICTID;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getAuditList(_httpParams);
    }

    // filter by audit status
    $scope.statusSelection = [];
    $scope.getAuListBySta = function(item) {
      var idx = $scope.statusSelection.indexOf(item.AUDIT_NAME);
      if (idx > -1) {
        $scope.statusSelection.splice(idx, 1);
      }
      else {
        $scope.statusSelection = item.AUDIT_NAME;
      }
      _httpParams.status = item.AUDIT_STATUS;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getAuditList(_httpParams);
    }
  }
])


/* HTTP */
Audit.factory('Department.Audit.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function getAuditTotal(params) {
      return $http.get(
        path + '/openInventory/countAll',
        {
          params:params
        }
      )
    };

    function getShareLevelFilter(params) {
      return $http.get(
        path + '/openInventory/countByShareLevel',
        {
          params:params
        }
      )
    }

    function getSpatialFilter(params) {
      return $http.get(
        path + '/openInventory/countBySpatial',
        {
          params:params
        }
      )
    }

    function getAuditStatusFilter(params) {
      return $http.get(
        path + '/openInventory/countByAuditStatus',{
          params:params
        }
      )
    }

    function getAuditList(params) {
      return $http.get(
        path + '/openInventory/inventoryList', {
          params:params
        }
      )
    }
    return {
      getAuditTotal: getAuditTotal,
      getShareLevelFilter: getShareLevelFilter,
      getSpatialFilter: getSpatialFilter,
      getAuditStatusFilter: getAuditStatusFilter,
      getAuditList: getAuditList
    }
  }
]);
