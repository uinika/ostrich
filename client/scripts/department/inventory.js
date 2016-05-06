'use strict';
var DInventory = angular.module('Department.Inventory', ['ui.router']);

/** Inventory Controller */
DInventory.controller('Department.Inventory.Controller.Main', ['$scope', '$q', 'Department.Inventory.Service.Http',
  function($scope, $q, Http) {
    var DEP_NAME = '统计局';
    $scope.DepartDataQuota = {};
    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    function getDepartmentQuotaList(_httpParams) {
      _httpParams.dep_name = DEP_NAME;
      Http.getDepartQuotaList(_httpParams).then(function(result) {
        console.log(result);
        $scope.depQuotaList = result.data.body;
        //  $scope.Paging.totalItems = data.head.total;
      });
    }


    //init
    getDepartmentQuotaList(_httpParams);

    // share level all
    $scope.getShareLevelAll = function() {
      $scope.shareLvMainSelection = [];
      _httpParams.share_level = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentQuotaList(_httpParams);
    }

    // filter by share level
    $scope.shareLvMainSelection = [];
    $scope.getDataQuotaListBySl = function(item) {
      var idx = $scope.shareLvMainSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.shareLvMainSelection = [];
      } else {
        $scope.shareLvMainSelection = item.id;
      }
      _httpParams.share_level = $scope.shareLvMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentQuotaList(_httpParams);
    }

    // share frequency all
    $scope.getShareFreqAll = function() {
      $scope.shareFreqSelection = [];
      _httpParams.share_frequency = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentQuotaList(_httpParams);
    }

    // filter by share frequency
    $scope.shareFreqSelection = [];
    $scope.getDataQuotaListBySF = function(item) {
      var idx = $scope.shareFreqSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.shareFreqSelection = [];
      } else {
        $scope.shareFreqSelection = item.id;
      }
      _httpParams.share_frequency = $scope.shareFreqSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentQuotaList(_httpParams);
    }


    // get spatial all
    $scope.getSpatialAll = function() {
      $scope.areaMainSelection = [];
      _httpParams.sys_dict_id = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentQuotaList(_httpParams);
    }

    // filter by partial
    $scope.areaMainSelection = [];
    $scope.getDataQuotaListByAP = function(item) {
      var idx = $scope.areaMainSelection.indexOf(item.id);
      // is currently selected
      if (idx > -1) {
        $scope.areaMainSelection.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.areaMainSelection.push(item.id);
      }

      _httpParams.sys_dict_id = $scope.areaMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentQuotaList(_httpParams);
    }

    // search by name
    $scope.searchDeptDataQuotaByName = function() {
      _httpParams.quota_name = $scope.DepartDataQuota.quota_name_filter;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentQuotaList(_httpParams);
    }
  }
])

/** Inventory Controller */
DInventory.controller('Department.Inventory.Controller.detail', ['$scope', '$q', 'Department.Inventory.Service.Http', '$stateParams', '$state',
  function($scope, $q, Http, $stateParams, $state) {
    console.log($stateParams.ID);
    Http.getQuotaDetail({
      data_quota_id: $stateParams.ID
    }).then(function(result) {

    })
  }
])

DInventory.controller('Department.Inventory.Controller.publish', ['$rootScope', '$scope', '$state', '$q', '$uibModal', 'Department.Inventory.Service.Component', 'Department.Inventory.Service.Http',
  function($rootScope, $scope, $state, $q, $uibModal, Component, Http) {
    var DATA_STORE_TYPE = 4;
    var DATA_SHOW_FORMAT = 6;
    var SECRET_FLAG = 5;
    var LEVEL_AUTH = '250375bd-02f0-11e6-a52a-5cf9dd40ad7e';
    var STORE_TYPE_OTHER = '25098ff3-02f0-11e6-a52a-5cf9dd40ad7e';
    var DATA_SHOW_OTHER = '2515e9b5-02f0-11e6-a52a-5cf9dd40ad7e';

    $scope.DataQuota = {};
    $scope.DataQuota.data_show_format_add = '';
    $scope.DataQuota.data_store_type_add = '';

    Http.getDepartmentList().then(function(result) {
      $scope.deptList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': DATA_STORE_TYPE
    }).then(function(result) {
      $scope.quotaTypeList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': DATA_SHOW_FORMAT
    }).then(function(result) {
      $scope.dataShowFormatList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': SECRET_FLAG
    }).then(function(result) {
      $scope.secretFlagList = result.data.body;
    });

    // submit add
    $scope.addQuota = function(isValid) {
      var DataQuotaAddObj = {};
      var dataRelationConfig = [];
      var dataQuotaApplyInfo = [];
      if (isValid) {
        console.log($scope.dataLevelSelection);
        DataQuotaAddObj.dataQuota = $scope.DataQuota;

        _($scope.dataLevelSelection).forEach(function(value) {
          var sys_dict = {};
          sys_dict.dataQuotaId = $scope.DataQuota.quota_name;
          sys_dict.sys_dict_id = value;
          dataRelationConfig.push(sys_dict);
        });

        var shareDeps = _.map($scope.outputDeptList, 'id');
        _(shareDeps).forEach(function(value) {
          var share_dep = {};
          share_dep.dataQuotaId = $scope.DataQuota.quota_name;
          share_dep.apply_dep = value;
          dataQuotaApplyInfo.push(share_dep);
        });

        DataQuotaAddObj.dataRelationConfig = dataRelationConfig;
        DataQuotaAddObj.dataQuotaApplyInfo = dataQuotaApplyInfo;

        console.log(DataQuotaAddObj);
        Http.saveDataQuota(DataQuotaAddObj).then(function(result) {
          console.log(result.data.head);
          if (200 == result.data.head.status) {
            alert('新增成功');
          }
        }).then(function() {
          $state.go("main.department.inventory", {}, {
            reload: true
          });
        })
      }
    }


    // show or hide department
    $scope.depShow = false;
    $scope.showHideDeps = function(ev) {
      if (LEVEL_AUTH == $scope.DataQuota.share_level) {
        $scope.depShow = true;
      } else {
        $scope.depShow = false;
      }
    }

    $scope.storeTypeOther = false;
    $scope.storeTypeChange = function() {
      if (STORE_TYPE_OTHER == $scope.DataQuota.data_store_type) {
        $scope.storeTypeOther = true;
      } else {
        $scope.storeTypeOther = false;
      }
    }

    $scope.dataShowOther = false;
    $scope.dataShowChange = function() {
      if (DATA_SHOW_OTHER == $scope.DataQuota.data_show_format) {
        $scope.dataShowOther = true;
      } else {
        $scope.dataShowOther = false;
      }
    }

    $scope.dataLevelSelection = [];
    $scope.toggleDataLevelSelection = function(item) {
      var idx = $scope.dataLevelSelection.indexOf(item.id);
      // is currently selected
      if (idx > -1) {
        $scope.dataLevelSelection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.dataLevelSelection.push(item.id);
      }
    };

  }
])

/* HTTP */
DInventory.factory('Department.Inventory.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function getDepartmentList() {
      return $http.get(
        path + '/department'
      )
    }

    function getDepartQuotaList(params) {
      return $http.get(
        path + '/data_quota', {
          params: params
        }
      )
    }

    function getQuotaDetail(params) {
      return $http.get(
        path + '/data_quota_detail', {
          params: params
        }
      )
    }

    function saveDataQuota(data) {
      return $http.post(
        path + '/data_quota', {
          data: data
        }
      )
    };


    return {
      saveDataQuota: saveDataQuota,
      getDepartmentList: getDepartmentList,
      getDepartQuotaList: getDepartQuotaList,
      getQuotaDetail: getQuotaDetail
    }
  }
]);



/* Component */
DInventory.service('Department.Inventory.Service.Component', ['$uibModal',
  function($uibModal) {
    // prompt Alert
    function popAlert(scope, info) {
      scope.Alerts = [{
        type: info.type,
        message: info.message,
        timeout: 1200
      }];
      scope.CloseAlert = function(index) {
        scope.Alerts.splice(index, 1);
      };
    };
    // prompt Modal
    function popModal(scope, type, templateUrl) {
      scope.Modal.type = type;
      var modalInstance = $uibModal.open({
        animation: true,
        backdrop: 'static',
        templateUrl: templateUrl + '.html',
        scope: scope
      });
      scope.Modal.confirm = function(isValid) {
        if (isValid) {
          modalInstance.close(scope.Modal);
        }

      };
      scope.Modal.cancel = function() {
        modalInstance.dismiss();
      };
      return modalInstance;
    };

    return {
      popAlert: popAlert,
      popModal: popModal
    }
  }
])
