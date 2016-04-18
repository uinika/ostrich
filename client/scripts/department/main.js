'use strict';
var Department = angular.module('Department', ['ui.router']);

/** Main Controller */
Department.controller('Department.Controller.Main', ['$scope', '$q','Department.Service.Http',
  function($scope, $q ,Http) {
    var starTime = getFirstDayMonth();
    var endTime = getNowDate();
    var depId = 1;

    // get current month
    function getFirstDayMonth() {
      var now = new Date();
      return now.getFullYear() + "-" + (now.getMonth() + 1) + "-01";
    }
    function getNowDate() {
      var now = new Date();
      return now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    }

    Http.getInventoryTotal().then(function(result) {
      $scope.inventoryTotal = result.data.body[0].TOTAL;
    });

    Http.getInventoryTotal({
      starTime: starTime,
      endTime: endTime
    }).then(function(result) {
      $scope.inventoryMonthTotal = result.data.body[0].TOTAL;
    });

    Http.getShareTotal().then(function(result) {
      $scope.shareTotal = result.data.body[0].TOTAL;
    });

    Http.getShareTotal({
      starTime: starTime,
      endTime: endTime
    }).then(function(result) {
      $scope.shareMonthTotal = result.data.body[0].TOTAL
    });

    Http.getRequirementTotal().then(function(result) {
      console.log(result);
      $scope.requirementTotal = result.data.body[0].TOTAL
    });

    Http.getRequirementTotal({
      starTime: starTime,
      endTime: endTime
    }).then(function(result) {
      $scope.requirementMonthTotal = result.data.body[0].total;
    });

    Http.getUnauditTotal().then(function(result) {
      $scope.unauditTotal = result.data.body[0].total;
    });

    Http.getInventoryList({
      skip: 0,
      limit: 6,
      status: 0 // 未审核状态
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

    function getInventoryTotal(params) {
      return $http.get(
        path + '/inventoryTotal/department',
        {params: params}
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
