'use strict';
var Inventory = angular.module('Inventory', ['ui.router']);

/** Main Controller */
Inventory.controller('Inventory.Controller.Main', ['$scope', '$state', 'Inventory.Service.Http',
  function($scope, $state, Http) {
    $scope.Inventory = {};

    function getAll(httpParams){
      Http.getShareDictWithInventoryNum(httpParams).then(function(result) {
        if(200 == result.data.head.status){
          $scope.Inventory.shareDict = result.data.body;
        }
      });
      Http.getAreaDictWithInventoryNum(httpParams).then(function(result) {
        if(200 == result.data.head.status){
          $scope.Inventory.areaDict = result.data.body;
        }
      });
      Http.getShareDictWithInventoryNum(httpParams).then(function(result) {
        if(200 == result.data.head.status){
          $scope.Inventory.shareDict = result.data.body;
        }
      });
    };

    Http.getDepWithInventoryNum().then(function(result) {
      if(200 == result.data.head.status){
        $scope.Inventory.departments = result.data.body;
      }
    });

    getAll();
    $scope.Inventory.switcher = function(target){
      var httpParams = {DEP_ID: target}
      getAll(httpParams);
    }



  }
])

/* HTTP Factory */
Inventory.factory('Inventory.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function getDepWithInventoryNum(params) {
      return $http.get(
        path + '/inventory/getDepWithInventoryNum'
      )
    };
    function getShareDictWithInventoryNum(params) {
      return $http.get(
        path + '/inventory/getShareDictWithInventoryNum', {params: params}
      )
    };
    function getAreaDictWithInventoryNum(params) {
      return $http.get(
        path + '/inventory/getAreaDictWithInventoryNum', {params: params}
      )
    };
    function inventoryList(params) {
      return $http.get(
        path + '/inventory/inventoryList', {params: params}
      )
    };
    function updateVisitCount(params) {
      return $http.put(
        path + '/inventory/updateVisitCount', {data: data}
      )
    };
    return {
      getDepWithInventoryNum: getDepWithInventoryNum,
      getShareDictWithInventoryNum: getShareDictWithInventoryNum,
      getAreaDictWithInventoryNum: getAreaDictWithInventoryNum,
      inventoryList: inventoryList,
      updateVisitCount: updateVisitCount
    }
  }
]);
