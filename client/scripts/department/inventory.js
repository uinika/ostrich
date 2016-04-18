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
    const QUOTA_TYPE = 4;
    const DATA_SHOW_FORMAT = 6;
    const SECRET_FLAG = 5;
    $scope.inventoryAttrList = [];
    $scope.DataExamps = [];

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
      $scope.deptList = result.data.body;
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

      $scope.DataExamps = $scope.inventoryAttrList;
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


        window.console.log($scope.outputDeptList);

        $scope.step1_data = {};
        var data_info_add_configs = [];

        var sys_dicts = _.union($scope.shareFreqSelection, $scope.dataLevelSelection);
        _(sys_dicts).forEach(function(value) {
          var sys_dict = {};
          sys_dict.dataInfoId = $scope.dataInfo.dataName
          sys_dict.sysDictId = value;
          data_info_add_configs.push(sys_dict);
        });

        var shareDeps = [];
        if($scope.dataInfo.shareLevel == '250375bd-02f0-11e6-a52a-5cf9dd40ad7e') {// 指定部门开放
          shareDeps = _.map($scope.outputDeptList, 'ID');
          $scope.dataInfo = _.assign($scope.dataInfo, {'shareDeps': shareDeps});
        }

        $scope.step1_data = _.assign({'dataInfo':$scope.dataInfo}, {'dataInfoAddConfigs': data_info_add_configs});

        window.console.log($scope.step1_data);
      }
    };

    // pop add attribute modal
    $scope.popAttrAddModal = function() {
      $scope.Modal = {}; // Clean scope of modal
      $scope.Modal.Quota = {}; // Clean scope of modal

      // Get system dict
      Http.getSystemDictByCatagory({
        'DICT_CATEGORY': QUOTA_TYPE
      }).then(function(result) {
        $scope.quotaTypeList = result.data.body;
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

        $scope.step2_data = {};
        $scope.dataQuota = [];

        _.forEach($scope.inventoryAttrList, function(item,index) {
          var step2_obj =_.assign({ 'dataInfoId': $scope.dataInfo.dataName }, item,{'showOrder' : index+1});
          $scope.dataQuota.push(step2_obj);
        });
        $scope.step2_data.dataQuota = $scope.dataQuota;
      });
    }

    $scope.ExampDatas = [];
    $scope.dataCells = [];
    $scope.step3_data = {};
    $scope.addExampData = function() {
      $scope.ExampModal = {}; // Clean scope of modal
      $scope.ExampModal.ExampData = {}; // Clean scope of modal

      $scope.rowDatas = [];


      Component.popModal($scope, '添加', 'add-example-modal').result.then(function() {
        window.console.log($scope.step2_data.dataQuota);
        _.forEach($scope.step2_data.dataQuota, function(item,index) {
            var dataObj = _.assign({'rowKey':item.showOrder}, {'dataQuotaValue':item.dataValue},{'dataQuotaId':item.quotaName})
            $scope.rowDatas.push(dataObj);
            $scope.dataCells.push(dataObj);
        })
        $scope.ExampDatas.push($scope.rowDatas);

        $scope.step3_data.dataExamples = $scope.dataCells;
      });
    }

    // total submit
    $scope.addFormSubmit = function() {
      $scope.step4_data = {};
      $scope.step4_data.dataOtherInfo =
      _.assign({ 'dataInfoId': $scope.dataInfo.dataName }, $scope.DataOtherInfo);

      $scope.submitObject = _.assign($scope.step1_data,$scope.step2_data,$scope.step3_data,$scope.step4_data);

      console.log($scope.submitObject);

      Http.saveInventory($scope.submitObject).then(function(result){
        console.log(result.data.head);
        if (200 == result.data.head.status) {
          alert('添加成功');
        }
      })
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
    return {
      saveInventory: saveInventory,
      getSystemDictByCatagory: getSystemDictByCatagory,
      getDepartmentList: getDepartmentList
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
