'use strict';
var DepartmentShare = angular.module('Department.Share', ['ui.router']);

/** InventoryDetail Controller */
DepartmentShare.controller('Department.Share.Controller.Main', ['$rootScope', '$scope', '$stateParams', 'Department.Share.Service.Http',
  function($rootScope, $scope, $stateParams, Http) {
    $scope.InventoryDetail = {};

  }
])

/* HTTP Factory */
DepartmentShare.Share.factory('Department.Share.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function getInventoryDetail(params) {
      return $http.get(
        path + '/inventory/getInventoryDetail', {params: params}
      )
    };
    function indicatorList(params) {
      return $http.get(
        path + '/indicator/indicatorList', {params: params}
      )
    };
    function examplesList(params) {
      return $http.get(
        path + '/examples/examplesList', {params: params}
      )
    };
    return {
      getInventoryDetail: getInventoryDetail,
      indicatorList: indicatorList,
      examplesList: examplesList
    }
  }
]);
