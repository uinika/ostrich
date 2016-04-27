'use strict';
var Inventory = angular.module('Inventory', ['ui.router']);

/** Main Controller */
Inventory.controller('Inventory.Controller.Main', ['$scope', '$state', 'Inventory.Service.Http',
  function($scope, $state, Http) {
    $scope.toggle = function (scope) {
      scope.toggle();
    };
 $scope.list = [{
   "id": 1,
   "title": "node1",
   "nodes": [{
     "id": 11,
     "title": "node1.1",
     "nodes": [{
       "id": 111,
       "title": "node1.1.1",
       "nodes": []
     }]
   }, {
     "id": 12,
     "title": "node1.2",
     "nodes": []
   }]
 }, {
   "id": 2,
   "title": "node2",
   "nodrop": true,
   "nodes": [{
     "id": 21,
     "title": "node2.1",
     "nodes": []
   }, {
     "id": 22,
     "title": "node2.2",
     "nodes": []
   }]
 }, {
   "id": 3,
   "title": "node3",
   "nodes": [{
     "id": 31,
     "title": "node3.1",
     "nodes": []
   }]
 }]

    $scope.Inventory = {};
    // Get department list
    Http.getDepWithInventoryNum().then(function(result) {
      if(200 == result.data.head.status){
        $scope.Inventory.departments = result.data.body;
      }
    });
    // Init another datas
    getAll();
    // Switch current scope
    $scope.Inventory.switcher = function(target){
      var httpParams = {DEP_ID: target}
      getAll(httpParams);
    }

    // Promise all
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
      Http.inventoryList(httpParams).then(function(result) {
        if(200 == result.data.head.status){
          $scope.Inventory.inventoryList = result.data.body;
        }
      });
    };

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
