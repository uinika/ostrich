'use strict';
var Department = angular.module('Department', ['ui.router']);

/** Main Controller */
Department.controller('Department.Controller.Main', ['$scope', '$q', 'Department.Service.Http', '$sce',
  function($scope, $q, Http, $sce) {
    var SHARE_FREQUENCY = 1;
    var DATA_LEVEL = 2;
    var SHARE_LEVEL = 3;
    // Get system dict
    Http.getSystemDictByCatagory({
      'dict_category': SHARE_FREQUENCY
    }).then(function(result) {
      $scope.shareFrequencyList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': SHARE_LEVEL
    }).then(function(result) {
      $scope.shareLevelList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': DATA_LEVEL
    }).then(function(result) {
      $scope.dataLevelList = result.data.body;
    });
    //var starTime = getFirstDayMonth();
    //var endTime = getNowDate();

    // get current month
    // function getFirstDayMonth() {
    //   var now = new Date();
    //   return "" + now.getFullYear() + "-" + (now.getMonth() + 1) + '-01 00:00:00';
    // }
    //
    // function getNowDate() {
    //   var now = new Date();
    //   return "" + now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + ' 23:59:59';
    // }
    //
    // $scope.dynamicPopover = {
    //   templateUrl: 'myPopoverTemplate.html'
    // };
    //
    // Http.getDepartmentList().then(function(result) {
    //   $scope.deptList = result.data.body;
    // });
    //
    // Http.getInventoryTotal(null).then(function(result) {
    //   $scope.inventoryTotal = result.data.body[0].TOTAL;
    // });
    // Http.getInventoryTotal({
    //   startDate: starTime,
    //   endDate: endTime
    // }).then(function(result) {
    //   $scope.inventoryMonthTotal = result.data.body[0].TOTAL;
    // });
    //
    // Http.getShareTotal().then(function(result) {
    //   $scope.shareTotal = result.data.body[0].TOTAL
    // });
    // Http.getShareTotal({
    //   startDate: starTime,
    //   endDate: endTime
    // }).then(function(result) {
    //   $scope.shareMonthTotal = result.data.body[0].TOTAL
    // });
    //
    // Http.getRequirementTotal().then(function(result) {
    //   $scope.requirementTotal = result.data.body[0].TOTAL;
    // });
    // Http.getRequirementTotal({
    //   startDate: starTime,
    //   endDate: endTime
    // }).then(function(result) {
    //   $scope.requirementMonthTotal = result.data.body[0].TOTAL;
    // });
    //
    // Http.getUnauditTotal().then(function(result) {
    //   $scope.unauditTotal = result.data.body[0].TOTAL;
    // });
    //
    // Http.getInventoryList({
    //   skip: 0,
    //   limit: 6
    // }).then(function(result) {
    //   $scope.unauditInventoryList = result.data.body;
    // })
    //
    // Http.getResponseList({
    //   skip: 0,
    //   limit: 6
    // }).then(function(result) {
    //   $scope.responseList = result.data.body;
    //   $scope.responseTotal = result.data.head.total;
    // })
    //
    // $scope.focus = function() {
    //   console.log($scope.outputDeptList);
    // }

  }
])


/* HTTP */
Department.factory('Department.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function getDepartmentList() {
      return $http.get(
        path + '/dep/'
      )
    }

    function getInventoryTotal(params) {
      return $http.get(
        path + '/inventoryTotal/department', {
          params: params
        }
      )
    };

    function getShareTotal(params) {
      return $http.get(
        path + '/shareTotal/department', {
          params: params
        }
      )
    };

    function getRequirementTotal(params) {
      return $http.get(
        path + '/requirementTotal/department', {
          params: params
        }
      )
    }

    function getUnauditTotal() {
      return $http.get(
        path + '/dataAuditInfoTotal/department'
      )
    }

    function getInventoryList(params) {
      return $http.get(
        path + '/inventory/department', {
          params: params
        }
      )
    }

    function getResponseList(params) {
      return $http.get(
        path + '/requirementResponse/department', {
          params: params
        }
      )
    }

    function getSystemDictByCatagory(params) {
      return $http.get(
        path + '/sys_dict', {
          params: params
        }
      )
    };
    return {
      getSystemDictByCatagory: getSystemDictByCatagory,
      getInventoryTotal: getInventoryTotal,
      getShareTotal: getShareTotal,
      getRequirementTotal: getRequirementTotal,
      getUnauditTotal: getUnauditTotal,
      getInventoryList: getInventoryList,
      getResponseList: getResponseList,
      getDepartmentList: getDepartmentList
    }
  }
]);
