'use strict';
var Department = angular.module('Department', ['ui.router']);

/** Main Controller */
Department.controller('Department.Controller.Main', ['$rootScope', '$scope', '$q', 'Department.Service.Http', '$sce','$state',
  function($rootScope, $scope, $q, Http, $sce, $state) {
    var DEP_ID = $rootScope.User.dep_id;
    var SHARE_FREQUENCY = 1;
    var DATA_LEVEL = 2;
    var SHARE_LEVEL = 3;
    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;
    var _httpConfirmParams = {};
    _httpConfirmParams.limit = 10;
    _httpConfirmParams.skip = 0;

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
      $state.go("main.department.requirementConfirm", {}, {
        reload: true
      });
    }
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
    return {
      getSystemDictByCatagory: getSystemDictByCatagory,
      getAuditList: getAuditList,
      getDepartmentRequirementList: getDepartmentRequirementList,
      getDepartmentList: getDepartmentList,
      getDepDataQuotaTotal: getDepDataQuotaTotal
    }
  }
]);
