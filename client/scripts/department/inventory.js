'use strict';
var DInventory = angular.module('Department.Inventory', ['ui.router']);

/** Inventory Controller */
DInventory.controller('Department.Inventory.Controller.Main', ['$scope','$q', 'Department.Inventory.Service.Http',
  function($scope , $q, Http) {

  }
])

DInventory.controller('Department.Inventory.Controller.publish', ['$scope',
  function($scope) {
    $scope.step1 = {};
    $scope.step2 = {};
    $scope.step3 = {};
    $scope.step4 = {};
    $scope.step1.show = true;
    $scope.step2.show = false;
    $scope.step3.show = false;
    $scope.step4.show = false;
    $scope.progress=25;

    $scope.toStep2 = function() {
      $scope.step2.show = true;
      $scope.step1.show = false;
      $scope.progress=50;
    }

    $scope.backToStep1 = function() {
      $scope.step1.show = true;
      $scope.step2.show = false;
      $scope.progress=25;
    }

    $scope.toStep3 = function() {
      $scope.step3.show = true;
      $scope.step2.show = false;
      $scope.progress=75;
    }

    $scope.backToStep2 = function() {
      $scope.step2.show = true;
      $scope.step3.show = false;
      $scope.progress=50;
    }

    $scope.toStep4 = function() {
      $scope.step4.show = true;
      $scope.step3.show = false;
      $scope.progress=100;
    }

    $scope.backToStep3 = function() {
      $scope.step3.show = true;
      $scope.step4.show = false;
      $scope.progress=75;
    }
  }
])

/* HTTP */
DInventory.factory('Department.Inventory.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;
    // function fetchResourceCatalog(params) {
    //   return $http.get(
    //     path + '/api/inventory', {params: params}
    //   )
    // };
    function saveInventory(data) {
      return $http.post(
        path + '/api/inventory/department', {data: data}
      )
    };
    // function findResourceCatalogbyID(id){
    //   return $http.get(
    //     path + '/api/resource-catalog/' + id
    //   )
    // };
    // function updateResourceCatalogbyID(data){
    //   return $http.put(
    //     path + '/api/resource-catalog/' + data.id, {data: data}
    //   )
    // };
    // function deleteResourceCatalogByIDs(data){
    //   return $http.delete(
    //     path + '/api/resource-catalog/', {data: data}
    //   )
    // };
    return {
      saveInventory: saveInventory
      // saveResourceCatalog: saveResourceCatalog,
      // findResourceCatalogbyID: findResourceCatalogbyID,
      // updateResourceCatalogbyID: updateResourceCatalogbyID,
      // deleteResourceCatalogByIDs: deleteResourceCatalogByIDs
    }
  }
]);
