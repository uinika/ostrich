'use strict';
var DepartmentShare = angular.module('DepartmentShare', ['ui.router']);

/** InventoryDetail Controller */
DepartmentShare.controller('DepartmentShare.Controller.Main', ['$rootScope', '$scope', '$stateParams', 'DepartmentShare.Service.Http',
  function($rootScope, $scope, $stateParams, Http) {
    $scope.DepartmentShare = {};
    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    //init
    getDepartmentShareList(_httpParams);

    function getDepartmentShareList(_httpParams) {
      Http.inventoryList(_httpParams).then(function(result) {
        $scope.depShareList = result.data.body;
        //  $scope.Paging.totalItems = data.head.total;
      });
    }

    Http.countAll().then(function(result) {
      if(200 == result.data.head.status){
        $scope.DepartmentShare.countAll = result.data.body[0].NUMBER;
      }
    });

    Http.countByShareLevel().then(function(result) {
      $scope.shareLevelList = result.data.body;
    });

    Http.countBySpatial().then(function(result) {
      $scope.areaPeriodList = result.data.body;
    });

    // filter by share level
    $scope.shareLvShareSelection = [];
    $scope.getIvntListBySl = function(item) {
      var idx = $scope.shareLvShareSelection.indexOf(item.SYS_DICT_ID);
      if (idx > -1) {
        $scope.shareLvShareSelection = [];
      } else {
        $scope.shareLvShareSelection = item.SYS_DICT_ID;
      }
      _httpParams.SHARE_LEVEL = $scope.shareLvShareSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // filter by partial
    $scope.areaShareSelection = [];
    $scope.getIvntListByAP = function(item) {
      var idx = $scope.areaShareSelection.indexOf(item.SYS_DICT_ID);
      // is currently selected
      if (idx > -1) {
        $scope.areaShareSelection.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.areaShareSelection.push(item.SYS_DICT_ID);
      }
      console.log($scope.areaShareSelection);

      _httpParams.AREA_DATA_LEVEL = $scope.areaShareSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // share level all
    $scope.getShareLevelAll = function() {
      $scope.shareLvShareSelection = [];
      _httpParams.SHARE_LEVEL = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // get spatial all
    $scope.getSpatialAll = function() {
      $scope.areaShareSelection = [];
      _httpParams.AREA_DATA_LEVEL = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }
  }
])

/* HTTP Factory */
DepartmentShare.factory('DepartmentShare.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function countAll(params) {
      return $http.get(
        path + '/shareInventory/countAll', {params: params}
      )
    };
    function countByShareLevel(params) {
      return $http.get(
        path + '/shareInventory/countByShareLevel', {params: params}
      )
    };
    function countBySpatial(params) {
      return $http.get(
        path + '/shareInventory/countBySpatial', {params: params}
      )
    };
    function inventoryList(params) {
      return $http.get(
        path + '/shareInventory/inventoryList', {params: params}
      )
    };
    return {
      countAll: countAll,
      countByShareLevel: countByShareLevel,
      countBySpatial: countBySpatial,
      inventoryList: inventoryList
    }
  }
]);
