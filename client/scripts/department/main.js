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
    var SECRET_FLAG = 5;
    var RESOURCE_FORMAT = 11;
    var SOCIAL_OPEN_FLAG = 14;
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
      $scope.mainAuditPromise = Http.getAuditList(_httpParams).then(function(result) {
        $scope.toAuditList = result.data.body[0].results;
        $scope.auditTotal = result.data.body[0].count;
      });
    }

    // init
    getDeptRequirementConfirmList();

    function getDeptRequirementConfirmList() {
      _httpConfirmParams.response_dep_id = DEP_ID;
      console.log(_httpConfirmParams);
      $scope.mainReqPromise = Http.getDepartmentRequirementList(_httpConfirmParams).then(function(result) {
        $scope.requireToConfirmList = result.data.body[0].results;
        $scope.reqTotal = result.data.body[0].count;
      })
    }

    Http.getSystemDictByCatagory({
      'dict_category': SECRET_FLAG
    }).then(function(result) {
      $scope.secretFlagList = result.data.body;
    });

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
      'dict_category': RESOURCE_FORMAT
    }).then(function(result) {
      $scope.resourceFormatList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': DATA_LEVEL
    }).then(function(result) {
      $scope.dataLevelList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': SOCIAL_OPEN_FLAG
    }).then(function(result) {
      $scope.socialOpenList = result.data.body;
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

    // 已关注部门列表
    Http.getFollowDepList().then(function(result) {
      $scope.parentObj.outputAllDeptList = result.data.body;
      $scope.followDeptList = _.uniq($scope.parentObj.outputAllDeptList);
      //console.log($scope.parentObj.outputAllDeptList);
      Http.getDepartmentFollowList().then(function(result) {
        $scope.parentObj.deptAllList = _.remove(result.data.body, function(item) {
          return item.dep_id != DEP_ID;
        });
        $scope.parentObj.outputDeptList = [];

        _($scope.parentObj.deptAllList).forEach(function(allItem) {
          allItem.icon = '<img  src=styles/images/bureau/'+ allItem.dep_en_name +' />'
          _($scope.parentObj.outputAllDeptList).forEach(function(outItem) {
            if(allItem.dep_id == outItem.dep_id) {
              allItem.ticked = true;
              $scope.parentObj.outputDeptList.push(allItem);
            }
          })
        });

         $scope.$broadcast('someEvent', $scope.parentObj.outputDeptList);
        // $scope.parentObj.deptAllList = _.pullAllWith($scope.parentObj.deptAllList, $scope.parentObj.outputAllDeptList,function(arrItem,othItem) {
        //   return arrItem.dep_id == othItem.dep_id || DEP_ID == arrItem.dep_id;
        // });
        // console.log($scope.parentObj.deptAllList);
      });
    })

    $scope.openFn = function() {
      $scope.parentObj.outputAllDeptList = $scope.parentObj.outputDeptList;
      console.log($scope.parentObj.outputAllDeptList);
    }



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
