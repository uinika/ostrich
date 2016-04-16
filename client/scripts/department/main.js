'use strict';
var Department = angular.module('Department', ['ui.router']);

/** Main Controller */
Department.controller('Department.Controller.Main', ['$scope', '$q','Department.Service.Http',
  function($scope, $q ,Http) {
    Http.getInventoryTotal().then(function(result) {
      $scope.InvtTotal = result.data.body[0];
    });

    Http.getShareTotal().then(function(result) {
      $scope.ShareTotal = result.data.body[0];
    });

    Http.getRequirementTotal().then(function(result) {
      $scope.ReqTotal = result.data.body[0];
    });

    Http.getUnauditTotal().then(function(result) {
      $scope.UnauditTotal = result.data.body[0];
    });

    Http.getInventoryList({
      skip: 0,
      limit: 6,
      statue: 0 // 未审核状态
    }).then(function(result) {
      $scope.unauditInventoryList = result.data.body;
    })

    Http.getResponseList({
      skip: 0,
      limit: 6
    }).then(function(result) {
      $scope.responseList = result.data.body;
      $scope.responseTotal = result.data.head.total;
    })
  }
])


/* HTTP */
Department.factory('Department.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function getInventoryTotal() {
      return $http.get(
        path + '/inventoryTotal/department'
      )
    };

    function getShareTotal() {
      return $http.get(
        path + '/shareTotal/department'
      )
    };

    function getRequirementTotal() {
      return $http.get(
        path + '/requirementTotal/department'
      )
    }

    function getUnauditTotal(){
      return $http.get(
        path + '/unauditTotal/department'
      )
    }

    function getInventoryList(params){
      return $http.get(
        path + '/inventory/department', {params: params}
      )
    }

    function getResponseList(params) {
      return $http.get(
        path + '/response/department', {params: params}
      )
    }
    return {
      getInventoryTotal: getInventoryTotal,
      getShareTotal: getShareTotal,
      getRequirementTotal: getRequirementTotal,
      getUnauditTotal: getUnauditTotal,
      getInventoryList: getInventoryList,
      getResponseList: getResponseList
    }
  }
]);
