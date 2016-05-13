'use strict';
var Department = angular.module('Department', ['ui.router']);

/** Main Controller */
Department.controller('Department.Controller.Main', ['$cookies', '$scope', '$q', 'Department.Service.Http', '$sce','$state',
  function($cookies, $scope, $q, Http, $sce, $state) {
    var LoginUser = JSON.parse($cookies.get('User'));
    var DEP_ID = LoginUser.dep_id;
    var SHARE_FREQUENCY = 1;
    var DATA_LEVEL = 2;
    var SHARE_LEVEL = 3;
    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;
    var _httpConfirmParams = {};
    _httpConfirmParams.limit = 10;
    _httpConfirmParams.skip = 0;

    // follow department
    $scope.depSelect = {};
    $scope.followDeptList = [];
    $scope.parentObj = {};
    function toFollowDep() {
      $scope.depSelect.show = false;
      $scope.followDeptList = $scope.parentObj.outputAllDeptList;
      // send request to add follow department
      var params = [];
      _($scope.followDeptList).forEach(function(item) {
        var followDep = {};
        followDep.follow_dep_id = item.dep_id;
        params.push(followDep);
      });
      Http.followDepts({
        userdep: params
      }).then(function(result) {

      })
    }

    // init
    getAuditList();

    function getAuditList() {
      _httpParams.audit_status = 0;
      Http.getAuditList(_httpParams).then(function(result) {
        $scope.toAuditList = result.data.body;
        $scope.auditTotal = result.data.head.total;
      });
    }

    // init
    getDeptRequirementConfirmList();

    function getDeptRequirementConfirmList() {
      //_httpConfirmParams.response_dep_id = DEP_ID;
      Http.getDepartmentRequirementList(_httpConfirmParams).then(function(result) {
        $scope.requireToConfirmList = result.data.body;
        $scope.reqTotal = result.data.head.total;
      })
    }



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

    Http.getDepDataQuotaTotal().then(function(result) {
      $scope.Count = result.data.body[0];
    });

    // go to audit list page
    $scope.auditMore = function() {
      $state.go("main.department.audit", {}, {
        reload: true
      });
    }

    // go to requirement list page
    $scope.reqMore = function() {
      $state.go("main.department.requirement", {}, {
        reload: true
      });
    }

    //select close callback
    $scope.closeFn = function() {
      toFollowDep();
    }

    // 已关注部门列表
    Http.getFollowDepList().then(function(result) {
      $scope.parentObj.outputAllDeptList = result.data.body;
      $scope.followDeptList = _.uniq($scope.parentObj.outputAllDeptList);

      Http.getDepartmentFollowList().then(function(result) {
        $scope.parentObj.deptAllList = result.data.body;
        console.log($scope.parentObj.deptAllList);
        console.log($scope.parentObj.outputAllDeptList);
        $scope.parentObj.deptAllList = _.pullAllWith($scope.parentObj.deptAllList, $scope.parentObj.outputAllDeptList,function(arrItem,othItem) {
          return arrItem.dep_id == othItem.dep_id;
        });
        console.log($scope.parentObj.deptAllList);
      });
    })





    $scope.followDep = function() {
      toFollowDep();
    }
  }
])


/* HTTP */
Department.factory('Department.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function getDepartmentFollowList() {
      return $http.get(
        path + '/follow_sys_dep'
      )
    }

    function getDepDataQuotaTotal() {
      return $http.get(
        path + '/depquota/summary'
      )
    };

    function getSystemDictByCatagory(params) {
      return $http.get(
        path + '/sys_dict', {
          params: params
        }
      )
    };

    function getAuditList(params) {
      return $http.get(
        path + '/opendata_quotalist', {
          params: params
        }
      )
    }

    function getDepartmentRequirementList(params) {
      return $http.get(
        path + '/data_requiement', {
          params: params
        }
      )
    };

    function getFollowDepList() {
      return $http.get(
        path + '/followed_user_dep'
      )
    }

    function followDepts(params) {
      return $http.post(
        path + '/user_dep_batch', {
          data: params
        }
      )
    }
    return {
      getSystemDictByCatagory: getSystemDictByCatagory,
      getAuditList: getAuditList,
      getDepartmentRequirementList: getDepartmentRequirementList,
      getDepartmentFollowList: getDepartmentFollowList,
      getDepDataQuotaTotal: getDepDataQuotaTotal,
      followDepts: followDepts,
      getFollowDepList: getFollowDepList
    }
  }
]);
