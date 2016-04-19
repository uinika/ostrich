'use strict';
var DepartmentShare = angular.module('DepartmentShare', ['ui.router']);

/** InventoryDetail Controller */
DepartmentShare.controller('DepartmentShare.Controller.Main', ['$rootScope', '$scope', '$stateParams', 'DepartmentShare.Service.Http',
  function($rootScope, $scope, $stateParams, Http) {
    $scope.DepartmentShare = {};
    Http.countAll({DEP_ID: $rootScope.User.DEP_ID}).then(function(result) {
      if(200 == result.data.head.status){
        $scope.DepartmentShare.countAll = result.data.body[0].NUMBER;
      }
    });
    Http.countByShareLevel({DEP_ID: $rootScope.User.DEP_ID}).then(function(result) {
  
    });
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
