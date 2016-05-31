'use strict';
var DepartmentShare = angular.module('DepartmentShare', ['ui.router']);

/** InventoryDetail Controller */
DepartmentShare.controller('DepartmentShare.Controller.Main', [ '$scope', 'DepartmentShare.Service.Http',
  function( $scope, Http) {
    $scope.DepartmentShare = {};

    $scope.Paging = {};
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    $scope.Paging.pageChanged = function() {
      _httpParams.skip = ($scope.Paging.currentPage - 1)*_httpParams.limit;
      getDepartmentShareList(_httpParams);
    }

    function getDepartmentShareList(_httpParams) {
      $scope.sharePromise = Http.shareDataQuotaList(_httpParams).then(function(result) {
        $scope.depShareList = result.data.body[0].results;
        $scope.Paging.totalItems = result.data.body[0].count;
      });
    }

    //init
    getDepartmentShareList(_httpParams);

    // share level all
    $scope.getShareLevelAllForShare = function() {
      $scope.shareLvShareSelection = [];
      _httpParams.share_level = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // filter by share level
    $scope.shareLvShareSelection = [];
    $scope.getShareDataQuotaListBySl = function(item) {
      var idx = $scope.shareLvShareSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.shareLvShareSelection = [];
      } else {
        $scope.shareLvShareSelection = item.id;
      }
      _httpParams.share_level = $scope.shareLvShareSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // get data level all
    $scope.getDataLevelAllForShare = function() {
      $scope.dataLevelShareSelection = [];
      _httpParams.sys_dict_id = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // filter by partial
    $scope.dataLevelShareSelection = [];
    $scope.getShareDataQuotaListByAP = function(item) {
      var idx = $scope.dataLevelShareSelection.indexOf(item.id);
      // is currently selected
      if (idx > -1) {
        $scope.dataLevelShareSelection.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.dataLevelShareSelection.push(item.id);
      }

      _httpParams.sys_dict_id = $scope.dataLevelShareSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // search by name
    $scope.searchShareDataQuotaByName = function() {
      _httpParams.quota_name = $scope.DepartmentShare.quota_name_filter;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // follow department
    $scope.followChange = function(event,depId) {
      var value = event.target.checked;
      console.log(value);
      if(value) {// follow
        Http.followDepartment({
          follow_dep_id: depId
        }).then(function(result) {
          if (200 == result.data.head.status) {

          }
          else {

          }
        })
      }
      else{// cancel follow
        Http.cancelFollowDepartment({
          follow_dep_id: depId
        }).then(function(result) {
          if (200 == result.data.head.status) {

          }
          else {

          }
        })
      }
    };


    var SHARE_FREQUENCY = 1;
    var DATA_LEVEL = 2;
    var SHARE_LEVEL = 3;
    var SECRET_FLAG = 5;
    var RESOURCE_FORMAT = 11;
    var SOCIAL_OPEN_FLAG = 14;
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

  }
])


// Department share detail controller
DepartmentShare.controller('DepartmentShare.Controller.detail', [ '$scope', 'DepartmentShare.Service.Http', '$stateParams',
  function( $scope, Http, $stateParams) {
    // get department share detail
    Http.getQuotaDetail({
      data_quota_id: $stateParams.ID
    }).then(function(result) {
      $scope.DataQuotaDetail = result.data.body[0];
    })

  }
])

/* HTTP Factory */
DepartmentShare.factory('DepartmentShare.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;

    function shareDataQuotaList(params) {
      return $http.get(
        path + '/sharedata_quotalist', {
          params: params
        }
      )
    };
    function getQuotaDetail(params) {
      return $http.get(
        path + '/data_quota_detail', {
          params: params
        }
      )
    };
    function followDepartment(id) {
      return $http.post(
        path + '/user_dep', {
          data: id
        }
      )
    };
    function getSystemDictByCatagory(params) {
      return $http.get(
        path + '/sys_dict', {
          params: params
        }
      )
    };
    function cancelFollowDepartment(id) {
      return $http.delete(
        path + '/user_dep', {
          data: id
        }
      )
    };
    return {
      getSystemDictByCatagory: getSystemDictByCatagory,
      shareDataQuotaList: shareDataQuotaList,
      getQuotaDetail: getQuotaDetail,
      followDepartment: followDepartment,
      cancelFollowDepartment: cancelFollowDepartment
    }
  }
]);
