'use strict';
var DInventory = angular.module('Department.Inventory', ['ui.router']);

/** Inventory Controller */
DInventory.controller('Department.Inventory.Controller.Main', ['$scope', '$q', '$uibModal', 'Department.Inventory.Service.Http',
  function($scope, $q, Http) {

  }
])

DInventory.controller('Department.Inventory.Controller.publish', ['$scope', '$q', '$uibModal', 'Department.Inventory.Service.Component','Department.Inventory.Service.Http',
  function($scope, $q, $uibModal, Component,Http) {
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
    const DATA_SHOW_FORMAT = 5;
    const SECRET_FLAG = 6;
    const DEPARTMENT = 7;

    $scope.inventoryAttrList = [];

    $scope.exampTitles = [];

    $scope.toStep2 = function() {
      $scope.step2.show = true;
      $scope.step1.show = false;
      $scope.progress = 50;
    }

    $scope.backToStep1 = function() {
      if (!$scope.ExampDatas || $scope.ExampDatas.length == 0) {
        alert('请先添加示例数据！');
        return;
      }

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
      }
    };

    // pop add attribute modal
    $scope.popAttrAddModal = function() {
      $scope.Modal = {}; // Clean scope of modal
      $scope.Modal.Quota = {}; // Clean scope of modal

      // Get system dict
      Http.getSystemDictByCatagory(SHARE_FREQUENCY).then(function(result) {
        $scope.shareFrequencyList = result.data;
      });
      Http.getSystemDictByCatagory(DATA_LEVEL).then(function(result) {
        $scope.dataLevelList = result.data;
      });
      Http.getSystemDictByCatagory(SHARE_LEVEL).then(function(result) {
        $scope.shareLevelList = result.data;
      });
      Http.getSystemDictByCatagory(QUATO_TYPE).then(function(result) {
        $scope.quatoTypeList = result.data;
      });
      Http.getSystemDictByCatagory(DATA_SHOW_FORMAT).then(function(result) {
        $scope.dataShowFormatList = result.data;
      });
      Http.getSystemDictByCatagory(SECRET_FLAG).then(function(result) {
        $scope.secretFlagList = result.data;
      });
      Http.getSystemDictByCatagory(DEPARTMENT).then(function(result) {
        $scope.deptList = result.data;
      });

      Component.popModal($scope, '添加', 'add-indicator-modal').result.then(function() {
        $scope.inventoryAttrList.push($scope.Modal.Quota);

        $scope.exampTitles = _.map($scope.inventoryAttrList, 'quotaName');

        var uuids = [];
        _.forEach($scope.exampTitles, function(value) {
          var uuid = Component.uuid(8, 2);
          uuids.push(uuid);
        });

        $scope.exampTitles = _.zip($scope.exampTitles, uuids);
        console.log($scope.exampTitles);

        $scope.exampTitles = _.map($scope.exampTitles, function(item) {
          return _.extend({
            name: item[0],
            uuid: item[1]
          }, item);
        });
      });
    }

    $scope.addExampData = function() {
      $scope.ExampModal = {}; // Clean scope of modal
      $scope.ExampModal.ExampData = {}; // Clean scope of modal
      Component.popModal($scope, '添加', 'add-example-modal').result.then(function() {
      });
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

    function getSystemDictByCatagory(id) {
      return $http.get(
        path + '/dict/' + id
      )
    };
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
      getSystemDictByCatagory: getSystemDictByCatagory
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

    function uuid(len, radix) {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
      var uuid = [],
        i;
      radix = radix || chars.length;

      if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
      } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random() * 16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
          }
        }
      }
      return uuid.join('');
    }
    return {
      popAlert: popAlert,
      popModal: popModal,
      uuid: uuid
    }
  }
])
