'use strict';
var DInventory = angular.module('Department.Inventory', ['ui.router']);

/** Inventory Controller */
DInventory.controller('Department.Inventory.Controller.Main', ['$scope', '$q', '$uibModal', 'Department.Inventory.Service.Http',
  function($scope, $q, Http) {

  }
])

DInventory.controller('Department.Inventory.Controller.publish', ['$scope', '$q', '$uibModal', 'Department.Inventory.Service.Component', 'Department.Inventory.Service.Http',
  function($scope, $q, $uibModal, Component, Http) {
    $scope.step1 = {};
    $scope.step2 = {};
    $scope.step3 = {};
    $scope.step4 = {};
    $scope.step1.show = true;
    $scope.step2.show = false;
    $scope.step3.show = false;
    $scope.step4.show = false;
    $scope.progress = 25;

    const SHARE_FREQUENCY = 1;
    const DATA_LEVEL = 2;
    const SHARE_LEVEL = 3;
    const QUATO_TYPE = 4;
    const DATA_SHOW_FORMAT = 6;
    const SECRET_FLAG = 5;

    $scope.inventoryAttrList = [];

    $scope.exampTitles = [];

    $scope.submitObject = {};

    // init
    $scope.shareFreqSelection = [];
    $scope.dataLevelSelection = [];
    // toggle selection for a given item by name
    $scope.toggleShareFreqSelection = function toggleShareFreqSelection(item) {
      var idx = $scope.shareFreqSelection.indexOf(item);

      // is currently selected
      if (idx > -1) {
        $scope.shareFreqSelection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.shareFreqSelection.push(item);
      }
    };

    $scope.toggleDataLevelSelection = function toggleDataLevelSelection(item) {
      var idx = $scope.dataLevelSelection.indexOf(item);

      // is currently selected
      if (idx > -1) {
        $scope.dataLevelSelection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.dataLevelSelection.push(item);
      }
    };

    Http.getSystemDictByCatagory({
      'DICT_CATEGORY': SHARE_FREQUENCY
    }).then(function(result) {
      $scope.shareFrequencyList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'DICT_CATEGORY': DATA_LEVEL
    }).then(function(result) {
      $scope.dataLevelList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'DICT_CATEGORY': SHARE_LEVEL
    }).then(function(result) {
      $scope.shareLevelList = result.data.body;
    });

    Http.getDepartmentList().then(function(result) {
      $scope.deptList = result.data;
    });

    $scope.backToStep1 = function() {
      $scope.step1.show = true;
      $scope.step2.show = false;
      $scope.progress = 25;
    }

    $scope.toStep3 = function() {
      if (!$scope.inventoryAttrList || $scope.inventoryAttrList.length == 0) {
        alert('请先添加指标属性！');
        return;
      }
      $scope.step3.show = true;
      $scope.step2.show = false;
      $scope.progress = 75;

      window.console.log($scope.inventoryAttrList);

    }

    $scope.backToStep2 = function() {
      $scope.step2.show = true;
      $scope.step3.show = false;
      $scope.progress = 50;
    }

    $scope.toStep4 = function() {
      if (!$scope.ExampDatas || $scope.ExampDatas.length == 0) {
        alert('请先添加示例数据！');
        return;
      }
      $scope.step4.show = true;
      $scope.step3.show = false;
      $scope.progress = 100;
    }

    $scope.backToStep3 = function() {
      $scope.step3.show = true;
      $scope.step4.show = false;
      $scope.progress = 75;
    }

    $scope.toStep2 = function(isValid) {
      if (isValid) {
        $scope.step2.show = true;
        $scope.step1.show = false;
        $scope.progress = 50;


        window.console.log($scope.dataInfo);
        window.console.log($scope.shareFreqSelection);
        window.console.log($scope.dataLevelSelection);

        var step1_data = {};
        var data_info_add_configs = [];

        var sys_dicts = _.union($scope.shareFreqSelection, $scope.dataLevelSelection);
        _(sys_dicts).forEach(function(value) {
          var sys_dict = {};
          sys_dict.DATA_INFO_ID = $scope.dataInfo.dataName
          sys_dict.SYS_DICT_ID = value;
          data_info_add_configs.push(sys_dict);
        });

        step1_data = _.assign({'dataInfo':$scope.dataInfo}, {'data_info_add_configs': data_info_add_configs});

        window.console.log(step1_data);
      }
    };

    // pop add attribute modal
    $scope.popAttrAddModal = function() {
      $scope.Modal = {}; // Clean scope of modal
      $scope.Modal.Quota = {}; // Clean scope of modal

      // Get system dict
      Http.getSystemDictByCatagory({
        'DICT_CATEGORY': QUATO_TYPE
      }).then(function(result) {
        $scope.quatoTypeList = result.data.body;
      });
      Http.getSystemDictByCatagory({
        'DICT_CATEGORY': DATA_SHOW_FORMAT
      }).then(function(result) {
        $scope.dataShowFormatList = result.data.body;
      });
      Http.getSystemDictByCatagory({
        'DICT_CATEGORY': SECRET_FLAG
      }).then(function(result) {
        $scope.secretFlagList = result.data.body;
      });


      Component.popModal($scope, '添加', 'add-indicator-modal').result.then(function() {
        $scope.inventoryAttrList.push($scope.Modal.Quota);

        $scope.exampTitles = _.map($scope.inventoryAttrList, 'quotaName');

        var step2_data = [];

        _.forEach($scope.inventoryAttrList, function(item) {
          var step2_obj =_.assign({ 'DATA_ID': $scope.dataInfo.DATA_NAME }, item);
          step2_data.push(step2_obj);
        });
        console.log(step2_data);


        // $scope.exampTitles = _.zip($scope.exampTitles, uuids);
        // console.log($scope.exampTitles);
        //
        // $scope.exampTitles = _.map($scope.exampTitles, function(item) {
        //   return _.extend({
        //     name: item[0],
        //     uuid: item[1]
        //   }, item);
        // });
      });
    }

    $scope.addExampData = function() {
      $scope.ExampModal = {}; // Clean scope of modal
      $scope.ExampModal.ExampData = {}; // Clean scope of modal
      Component.popModal($scope, '添加', 'add-example-modal').result.then(function() {});
    }
  }
])

/* HTTP */
DInventory.factory('Department.Inventory.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;
    // function fetchResourceCatalog(params) {
    //   return $http.get(
    //     path + '/api/inventory', {params: params}
    //   )
    // };
    function saveInventory(data) {
      return $http.post(
        path + '/inventory/department', {
          data: data
        }
      )
    };

    function getSystemDictByCatagory(params) {
      return $http.get(
        path + '/dict', {
          params: params
        }
      )
    };

    function getDepartmentList() {
      return $http.get(
        path + '/dep/'
      )
    }
    // function findResourceCatalogbyID(id){
    //   return $http.get(
    //     path + '/api/resource-catalog/' + id
    //   )
    // };
    // function updateResourceCatalogbyID(data){
    //   return $http.put(
    //     path + '/api/resource-catalog/' + data.id, {data: data}
    //   )
    // };
    // function deleteResourceCatalogByIDs(data){
    //   return $http.delete(
    //     path + '/api/resource-catalog/', {data: data}
    //   )
    // };
    return {
      saveInventory: saveInventory,
      getSystemDictByCatagory: getSystemDictByCatagory,
      getDepartmentList: getDepartmentList
        // saveResourceCatalog: saveResourceCatalog,
        // findResourceCatalogbyID: findResourceCatalogbyID,
        // updateResourceCatalogbyID: updateResourceCatalogbyID,
        // deleteResourceCatalogByIDs: deleteResourceCatalogByIDs
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
