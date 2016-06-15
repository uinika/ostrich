'use strict';
var Audit = angular.module('Department.Audit', ['ui.router']);

/** Main Controller */
Audit.controller('Department.Audit.Controller.Main', ['$scope', '$q', 'Department.Audit.Service.Http',
  function($scope, $q, Http) {
    $scope.InfoResource = {};

    $scope.Paging = {};
    $scope.Paging.currentPage = 1;
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    $scope.Paging.pageChanged = function() {
      _httpParams.skip = ($scope.Paging.currentPage - 1)*_httpParams.limit;
      getAuditList(_httpParams);
    }

    // init
    getAuditList();

    function getAuditList() {
      $scope.auditPromise = Http.getAuditList(_httpParams).then(function(result) {
        $scope.auditList = result.data.body[0].results;
        $scope.resourceCount = result.data.body[0].count[0].resource_count;
        $scope.Paging.totalItems = result.data.body[0].count[0].item_count;
      });
    }

    $scope.searchInfoResourceByName = function() {
      _httpParams.resource_name = $scope.InfoResource.resource_name_filter;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getAuditList();
    }

    // 根据审核状态过滤
    $scope.filterByAuditStatus = function(status) {
      _httpParams.auditstatus = status;
      getAuditList();
    }
  }
])


Audit.controller('Department.Audit.Controller.info', ['$scope', '$state', '$q', 'Department.Audit.Service.Http', '$stateParams',
  function( $scope, $state, $q, Http, $stateParams) {
    $scope.TabItemShow = true;
    $scope.TabRequireShow = true;
    $scope.AuditInfo = {};
    $scope.AuditInfo.audit_opinion = '';

    // 根据id查询信息资源详情
    Http.getDepartInfoResList({
      resource_id : $stateParams.RESOURCEID
    }).then(function(ResourceRes) {
      $scope.InfoResourceDetail = ResourceRes.data.body[0].results[0];
      $scope.InfoResourceDetail.apply_dep_name = $stateParams.APPLYDEP;
      $scope.InfoResourceDetail.apply_time = $stateParams.APPLYTIME;
    })


    $scope.InfoItemShow = false;
    Http.getInfoItemList({
      resource_id: $stateParams.RESOURCEID
    }).then(function(result) {
      if (result.data.body.length == 0) {
        $scope.InfoItemShow = false;
      } else {
        $scope.InfoItemShow = true;
        $scope.InfoItems = result.data.body;
      }
    })


    $scope.submitAudit = function() {
      console.log($scope.AuditInfo.audit_status);
      if(!$scope.AuditInfo.audit_status) {
        $scope.auditError = true;
        return;
      }
      $scope.AuditInfo.audit_id = $stateParams.AUDITID;
      Http.updateAuditDetail($scope.AuditInfo).then(function(result) {
        if (200 == result.data.head.status) {
          alert('审核成功');
          $state.go("main.department.audit", {}, {
            reload: true
          });
        } else {
          alert('审核失败');
        }
      });
    }
  }
])

/* HTTP */
Audit.factory('Department.Audit.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function getAuditList(params) {
      return $http.get(
        path + '/openinfo_resourcelist', {
          params: params
        }
      )
    }

    function getInfoResourceDetail(params) {
      return $http.get(
        path + '/data_quota_detail', {
          params: params
        }
      )
    }

    function updateAuditDetail(data) {
      return $http.put(
        path + '/openinfo_resourceok', {
          data: data
        }
      )
    }

    function getQuotaRequirement(params) {
      return $http.get(
        path + '/requiement_detail', {
          params: params
        }
      )
    }
    function getInfoItemList(params) {
      return $http.get(
        path + '/item_detail', {
          params: params
        }
      )
    }
    function getDepartInfoResList(params) {
      return $http.get(
        path + '/info_resource_list', {
          params: params
        }
      )
    }
    return {
      getAuditList: getAuditList,
      getInfoResourceDetail: getInfoResourceDetail,
      updateAuditDetail: updateAuditDetail,
      getQuotaRequirement: getQuotaRequirement,
      getInfoItemList: getInfoItemList,
      getDepartInfoResList: getDepartInfoResList
    }
  }
]);
