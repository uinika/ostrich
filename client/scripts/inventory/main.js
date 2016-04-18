'use strict';
var Inventory = angular.module('Inventory', ['ui.router']);

/** Main Controller */
Inventory.controller('Inventory.Controller.Main', ['$scope', '$state', 'Inventory.Service.Http',
  function($scope, $state, Http) {
    $scope.Inventory = {};
    Http.getDepWithInventoryNum().then(function(result) {
      if(200 == result.data.head.status){
        $scope.Inventory.departments = result.data.body;
      }
    });

    $scope.Inventory.switcher = function(target){
      console.log(target);
      Http.getShareDictWithInventoryNum().then(function(result) {
        if(200 == result.data.head.status){
          $scope.Inventory.shareDict = result.data.body;
        }
      });
      Http.getAreaDictWithInventoryNum().then(function(result) {
        if(200 == result.data.head.status){
          $scope.Inventory.areaDict = result.data.body;
        }
      });
      Http.inventoryList().then(function(result) {
        if(200 == result.data.head.status){
          $scope.Inventory.shareDict = result.data.body;
        }
      });
    }


  }
])

/* HTTP Factory */
Inventory.factory('Inventory.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function getDepWithInventoryNum(params) {
      return $http.get(
        path + '/getDepWithInventoryNum', {params: params}
      )
    };
    function getShareDictWithInventoryNum(params) {
      return $http.get(
        path + '/getDepWithInventoryNum', {params: params}
      )
    };
    function getAreaDictWithInventoryNum(params) {
      return $http.get(
        path + '/getDepWithInventoryNum', {params: params}
      )
    };
    function inventoryList(params) {
      return $http.get(
        path + '/getDepWithInventoryNum', {params: params}
      )
    };
    function updateVisitCount(params) {
      return $http.put(
        path + '/getDepWithInventoryNum', {data: data}
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
