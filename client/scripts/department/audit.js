'use strict';
var Audit = angular.module('Department.Audit', ['ui.router']);

/** Main Controller */
Audit.controller('Department.Audit.Controller.Main', ['$rootScope', '$scope', '$q', 'Department.Audit.Service.Http',
  function($rootScope, $scope, $q, Http) {
    $scope.DeptAudit = {};

    $scope.Paging = {};
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    $scope.Paging.pageChanged = function() {
      _httpParams.skip = $scope.Paging.currentPage - 1;
      getAuditList(_httpParams);
    }

    // init
    getAuditList();

    function getAuditList() {
      Http.getAuditList(_httpParams).then(function(result) {
        $scope.auditList = result.data.body;
        $scope.Paging.totalItems = result.data.head.total;
      });
    }

    $scope.searchDeptAuditByName = function() {
      _httpParams.quota_name = $scope.DeptAudit.quota_name_filter;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getAuditList();
    }


  }
])


Audit.controller('Department.Audit.Controller.info', ['$rootScope', '$scope', '$state', '$q', 'Department.Audit.Service.Http', '$stateParams',
  function($rootScope, $scope, $state, $q, Http, $stateParams) {
    // get audit detail by id
    Http.getAuditDetail($stateParams.AUDITID).then(function(result) {
      $scope.AuditDetail = result.data.body[0];
      console.log($scope.AuditDetail);
    })

    // login Department
    $scope.Tab = {};

    $scope.tabSwitcher = function(num) {

      switch (num) {
        case 'auditInfo':
          $scope.Tab.show = {};
          $scope.Tab.show.auditInfo = true;
          break;
        case 'auditExampData':
          $scope.Tab.show = {};
          $scope.Tab.show.auditExampData = true;
          break;
        case 'requirementInfo':
          $scope.Tab.show = {};
          $scope.Tab.show.requirementInfo = true;
          break;
        default:
        case 2:
          $scope.Tab = {};
          $scope.Tab.auditInfo.show = true;
          break;

      }
    }



    $scope.submitAudit = function() {
      $scope.AuditInfo.id = $scope.AuditDetail.id;
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
        path + '/opendata_quotalist', {
          params: params
        }
      )
    }

    function getAuditDetail(params) {
      return $http.get(
        path + '/opendata_quotamesg', {
          params: params
        }
      )
    }

    function updateAuditDetail(data) {
      return $http.put(
        path + '/opendata_quotaok', {
          data: data
        }
      )
    }
    return {
      getAuditList: getAuditList,
      getAuditDetail: getAuditDetail,
      updateAuditDetail: updateAuditDetail
    }
  }
]);
