'use strict';
var DInventory = angular.module('Department.Inventory', ['ui.router', 'ngCookies', 'cgBusy']);

/** Inventory Controller */
DInventory.controller('Department.Inventory.Controller.Main', ['$cookies', '$scope', '$q', 'Department.Inventory.Service.Http',
  function($cookies, $scope, $q, Http) {
    var SHARE_FREQUENCY = 1;
    var DATA_LEVEL = 2;
    var SHARE_LEVEL = 3;
    var SECRET_FLAG = 5;
    var RESOURCE_FORMAT = 11;
    var SOCIAL_OPEN_FLAG = 14;

    var LoginUser = JSON.parse($cookies.get('User'));
    var DEP_NAME = LoginUser.dep_id;
    $scope.DepartInfoResource = {};

    $scope.Paging = {};
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

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

    $scope.Paging.pageChanged = function() {
      _httpParams.skip = ($scope.Paging.currentPage - 1) * _httpParams.limit;
      getDeptInfoResourceList(_httpParams);
    }

    function getDeptInfoResourceList(_httpParams) {
      //_httpParams.dep_name = DEP_NAME;
      $scope.promise = Http.getDepartInfoResList(_httpParams).then(function(result) {
        console.log(result);
        $scope.infoResourceList = result.data.body[0].results;
        $scope.Paging.totalItems = result.data.body[0].count;
      });
    }


    //init
    getDeptInfoResourceList(_httpParams);

    // resource format all
    $scope.getResFormatAll = function() {
      $scope.resFormatMainSelection = [];
      _httpParams.re_format = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // share level all
    $scope.getShareLevelAll = function() {
      $scope.shareLvMainSelection = [];
      _httpParams.share_level = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // social open all
    $scope.getSocialOpenAll = function() {
      $scope.socialOpenMainSelection = [];
      _httpParams.social_open_flag = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // share frequency all
    $scope.getShareFreqAll = function() {
      $scope.shareFreqSelection = [];
      _httpParams.update_period = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // secret flag all
    $scope.getSecretFlagAll = function() {
      $scope.secretFlagMainSelection = [];
      _httpParams.issecret = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // filter by resource format
    $scope.resFormatMainSelection = [];
    $scope.getInfoResourceByResFormat = function(item) {
      var idx = $scope.shareFreqSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.resFormatMainSelection = [];
      } else {
        $scope.resFormatMainSelection = item.id;
      }
      _httpParams.re_format = $scope.resFormatMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // filter by share frequency
    $scope.shareFreqSelection = [];
    $scope.getInfoResourceListBySF = function(item) {
      var idx = $scope.shareFreqSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.shareFreqSelection = [];
      } else {
        $scope.shareFreqSelection = item.id;
      }
      _httpParams.update_period = $scope.shareFreqSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // filter by share level
    $scope.shareLvMainSelection = [];
    $scope.getInfoResourceListBySl = function(item) {
      var idx = $scope.shareLvMainSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.shareLvMainSelection = [];
      } else {
        $scope.shareLvMainSelection = item.id;
      }
      _httpParams.share_level = $scope.shareLvMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // filter by social open flag
    $scope.socialOpenMainSelection = [];
    $scope.getInfoResourceListBySO = function(item) {
      var idx = $scope.socialOpenMainSelection.indexOf(item.dict_code);
      if (idx > -1) {
        $scope.socialOpenMainSelection = [];
      } else {
        $scope.socialOpenMainSelection = item.dict_code;
      }
      _httpParams.social_open_flag = $scope.socialOpenMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // filter by secret flag
    $scope.secretFlagMainSelection = [];
    $scope.getInfoResourceListBySecFlag = function(item) {
      var idx = $scope.secretFlagMainSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.secretFlagMainSelection = [];
      } else {
        $scope.secretFlagMainSelection = item.id;
      }
      _httpParams.issecret = $scope.secretFlagMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }


    // get spatial all
    $scope.getSpatialAll = function() {
      $scope.areaMainSelection = [];
      _httpParams.area_level = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // filter by partial
    $scope.areaMainSelection = [];
    $scope.getInfoResourceListByAP = function(item) {
      var idx = $scope.areaMainSelection.indexOf(item.id);
      // is currently selected
      if (idx > -1) {
        $scope.areaMainSelection.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.areaMainSelection.push(item.id);
      }

      _httpParams.area_level = $scope.areaMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // search by name
    $scope.searchDeptInfoResourceByName = function() {
      _httpParams.resource_name = $scope.DepartInfoResource.resource_name_filter;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // delete data quota
    $scope.deleteQuota = function(event, quotaId) {
      var deleteFlag = event.target.checked;
      Http.deleteDataQuota({
        id: quotaId,
        delete_flag: deleteFlag ? 'true' : 'false'
      }).then(function(result) {
        if (200 == result.data.head.status) {

        }
      })
    }
  }
])

/** Inventory Controller */
DInventory.controller('Department.Inventory.Controller.detail', ['$scope', '$q', 'Department.Inventory.Service.Http', '$stateParams', '$state',
  function($scope, $q, Http, $stateParams, $state) {
    console.log($stateParams.ID);
    Http.getInfoResourceDetail({
      data_quota_id: $stateParams.ID
    }).then(function(result) {
      $scope.DataQuotaDetail = result.data.body[0];

    })
  }
])

DInventory.controller('Department.Inventory.Controller.publish', ['$cookies', '$scope', '$stateParams', '$state', '$q', '$uibModal', 'Department.Inventory.Service.Component', 'Department.Inventory.Service.Http',
  function($cookies, $scope, $stateParams, $state, $q, $uibModal, Component, Http) {
    var RESOURCE_CATEGORY = 10;
    var SHARE_TYPE = 12;
    var SHARE_METHOD = 13;
    var ITEM_TYPE = 15;
    var LEVEL_AUTH = '250375bd-02f0-11e6-a52a-5cf9dd40ad7e'; // 授权开放
    var LEVEL_ALL_OPEN = '2501e32c-02f0-11e6-a52a-5cf9dd40ad7e'; // 全开放
    var RESOURCE_FORMAT_DATA = 'aaee8194-2614-11e6-a9e9-507b9d1b58bb';
    var RESOURCE_FORMAT_OTHER = 'ab11fdd4-2614-11e6-a9e9-507b9d1b58bb';
    var SHARE_METHOD_OTHER = 'd8d61ff3-2616-11e6-a9e9-507b9d1b58bb';

    var LoginUser = JSON.parse($cookies.get('User'));
    var DEP_ID = LoginUser.dep_id;
    $scope.DEP_NAME = LoginUser.dep_name;
    $scope.InfoResource = {};
    $scope.InfoResource.alias = '';
    $scope.InfoResource.rel_category = '';
    $scope.InfoResource.secret_flag = '';
    $scope.InfoResource.meter_unit = "";
    $scope.InfoResource.calculate_method = '';
    $scope.InfoResource.resource_format_other = '';
    $scope.InfoResource.share_method_other = '';
    $scope.InfoResource.social_open_limit = '';
    $scope.InfoResource.linkman = '';
    $scope.InfoResource.contact_phone = '';
    // item list
    $scope.ResourceItemList = [];
    $scope.ResourceItemListShow = [];
    $scope.ResourceItemConfigList = [];



    Http.getDepartmentList().then(function(result) {
      $scope.deptList = result.data.body;
      var evens = _.remove($scope.deptList, function(item) {
        return item.id == DEP_ID;
      });
    });

    Http.getSystemDictByCatagory({
      'dict_category': RESOURCE_CATEGORY
    }).then(function(result) {
      $scope.resourceCategoryList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': SHARE_TYPE
    }).then(function(result) {
      $scope.shareTypeList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': SHARE_METHOD
    }).then(function(result) {
      $scope.shareMethodList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': ITEM_TYPE
    }).then(function(result) {
      $scope.itemTypeList = result.data.body;
    });

    $scope.close = function(isValid) {
      $state.go("main.department.inventory", {}, {
        reload: true
      });
    }

    // submit add
    $scope.addInfoResource = function(isValid) {
      $scope.submitted = true;
      var InfoResourceAddObj = {};
      var InfoResource_RelationConfig = [];
      var InfoResourceApplyInfo = [];
      var InfoItem_RelationConfig = [];
      if ($scope.shareFreqSelection.length == 0 && !$scope.resItemAddBtn) { // 未选择更新周期
        isValid = false;
      }
      if ($scope.resItemAddBtn && ($scope.ResourceItemList.length == 0)) { // 未添加信息项
        isValid = false;
      }

      if (isValid) {
        InfoResourceAddObj.InfoResource = $scope.InfoResource;
        _($scope.dataLevelSelection).forEach(function(value) {
          var sys_dict = {};
          sys_dict.InfoResourceId = $scope.InfoResource.resource_name;
          sys_dict.sys_dict_id = value;
          InfoResource_RelationConfig.push(sys_dict);
        });

        _($scope.shareFreqSelection).forEach(function(value) {
          var sys_dict = {};
          sys_dict.InfoResourceId = $scope.InfoResource.resource_name;
          sys_dict.sys_dict_id = value;
          sys_dict.obj_type = 1;
          InfoResource_RelationConfig.push(sys_dict);
        });

        var shareDeps = _.map($scope.outputDeptList, 'id');
        _(shareDeps).forEach(function(value) {
          var share_dep = {};
          share_dep.InfoResourceId = $scope.InfoResource.resource_name;
          share_dep.apply_dep = value;
          InfoResourceApplyInfo.push(share_dep);
        });
        _($scope.ResourceItemList).forEach(function(item, index) {
          console.log(index);
          item.item_ord = index;
          item.InfoResourceId = $scope.InfoResource.resource_name;
          console.log($scope.ResourceItemList);
        })

        InfoResourceAddObj.InfoResource_RelationConfig = InfoResource_RelationConfig;
        InfoResourceAddObj.InfoResourceApplyInfo = InfoResourceApplyInfo;
        InfoResourceAddObj.InfoItem_RelationConfig = $scope.ResourceItemConfigList;
        InfoResourceAddObj.InfoItem = $scope.ResourceItemList;

        console.log(InfoResourceAddObj);
        Http.saveInfoResource(InfoResourceAddObj).then(function(result) {
          console.log(result.data);
          if (200 == result.data.head.status) {
            $scope.Modal = {};
            $state.go("main.department.inventory", {}, {
              reload: true
            });

          } else {
            alert('保存失败');
          }
        })
      } else {
        return;
      }
    }


    // submit update
    console.log($stateParams.item);
    $scope.resItemUpdateBtn = false;
    if ($stateParams.item) { // 选择修改
      $scope.InfoResource = $stateParams.item;
      // 选中数据库类
      if (RESOURCE_FORMAT_DATA == $scope.InfoResource.resource_format) {
        $scope.resItemUpdateBtn = true;
      }
    }


    $scope.updateInfoResource = function(isValid) {
      $scope.submitted = true;
      var InfoResourceAddObj = {};
      var InfoResource_RelationConfig = [];
      var InfoResourceApplyInfo = [];
      var InfoItem_RelationConfig = [];
      if ($scope.shareFreqSelection.length == 0 && !$scope.resItemUpdateBtn) { // 未选择更新周期
        isValid = false;
      }
      if ($scope.resItemAddBtn && ($scope.ResourceItemList.length == 0)) { // 未添加信息项
        isValid = false;
      }

      if (isValid) {
        InfoResourceAddObj.InfoResource = $scope.InfoResource;
        _($scope.dataLevelSelection).forEach(function(value) {
          var sys_dict = {};
          sys_dict.InfoResourceId = $scope.InfoResource.id;
          sys_dict.sys_dict_id = value;
          InfoResource_RelationConfig.push(sys_dict);
        });

        _($scope.shareFreqSelection).forEach(function(value) {
          var sys_dict = {};
          sys_dict.InfoResourceId = $scope.InfoResource.id;
          sys_dict.sys_dict_id = value;
          sys_dict.obj_type = 1;
          InfoResource_RelationConfig.push(sys_dict);
        });

        var shareDeps = _.map($scope.outputDeptList, 'id');
        _(shareDeps).forEach(function(value) {
          var share_dep = {};
          share_dep.InfoResourceId = $scope.InfoResource.id;
          share_dep.apply_dep = value;
          InfoResourceApplyInfo.push(share_dep);
        });
        _($scope.ResourceItemList).forEach(function(item, index) {
          console.log(index);
          item.item_ord = index;
          item.InfoResourceId = $scope.InfoResource.id;
          console.log($scope.ResourceItemList);
        })

        InfoResourceAddObj.InfoResource_RelationConfig = InfoResource_RelationConfig;
        InfoResourceAddObj.InfoResourceApplyInfo = InfoResourceApplyInfo;
        InfoResourceAddObj.InfoItem_RelationConfig = $scope.ResourceItemConfigList;
        InfoResourceAddObj.InfoItem = $scope.ResourceItemList;

        console.log(InfoResourceAddObj);
        Http.updateInfoResource(InfoResourceAddObj).then(function(result) {
          console.log(result.data);
          if (200 == result.data.head.status) {
            $scope.Modal = {};
            $state.go("main.department.inventory", {}, {
              reload: true
            });

          } else {
            alert('保存失败');
          }
        })
      } else {
        return;
      }
    }

    $scope.editItems = function() {
      Http.getItemList({}).then(function(result) {
        $scope.ResourceItemListShow = result.data.body;
      })
      $scope.ResItemListShow = true;
    }

    $scope.addResourceItem = function() {
      $scope.Modal = {};
      $scope.itemAdded = false;
      $scope.ResourceItem = {};
      $scope.ResourceItem.meter_unit = '';
      $scope.ResourceItem.calculate_method = '';
      $scope.shareFreqItemSelection = [];
      $scope.shareFreqItemObjSelection = [];
      Component.popModal($scope, 'Department.Inventory.Controller.publish', '', 'item-add-modal').result.then(function(res) {
        $scope.itemAdded = false;
        $scope.ResourceItemList.push($scope.ResourceItem);
        var shareFreqDictName = [];
        _($scope.shareFreqItemObjSelection).forEach(function(item) {
          var sys_dict = {};
          sys_dict.InfoItemId = $scope.ResourceItem.item_name;
          sys_dict.sys_dict_id = item.id;
          $scope.ResourceItemConfigList.push(sys_dict);
          shareFreqDictName.push(item.dict_name);
        });
        $scope.ResourceItem.shareFreqDictName = shareFreqDictName;
        $scope.ResourceItemListShow.push($scope.ResourceItem);
      })
    }


    // show or hide department
    $scope.depShow = false;
    $scope.showHideDeps = function(ev) {
      if (LEVEL_ALL_OPEN != $scope.InfoResource.share_level) {
        if (LEVEL_AUTH == $scope.InfoResource.share_level) {
          $scope.depShow = true;
          $scope.socialOpenFlag = false;
        } else {
          $scope.depShow = false;
          $scope.socialOpenFlag = true;
        }
        $scope.InfoResource.social_open_flag = 0;
      } else {
        $scope.InfoResource.social_open_flag = 1;
      }

    }

    $scope.shareMethodOtherShow = false;
    $scope.showHideShareMethodOther = function() {
      if (SHARE_METHOD_OTHER == $scope.InfoResource.share_method) {
        $scope.shareMethodOtherShow = true;
      } else {
        $scope.shareMethodOtherShow = false;
      }
    }

    //show or hide resource item add button
    $scope.resItemAddBtn = false;
    $scope.resFormatOtherShow = false;
    $scope.showHideResAddBtn = function() {
      $scope.resFormatOtherShow = false;
      if (RESOURCE_FORMAT_DATA == $scope.InfoResource.resource_format) {
        if ($stateParams.item) { // 修改
          $scope.resItemUpdateBtn = true;
        } else { // 新增
          $scope.resItemAddBtn = true;
        }

        $scope.resFormatOtherShow = false;
        $scope.shareFreqSelection = [];
        $scope.InfoResource.secret_flag = '';
        $scope.InfoResource.meter_unit = "";
        $scope.InfoResource.calculate_method = '';
      } else if (RESOURCE_FORMAT_OTHER == $scope.InfoResource.resource_format) {
        $scope.resFormatOtherShow = true;
        $scope.resItemAddBtn = false;
        $scope.resItemUpdateBtn = false;
      } else {
        $scope.resItemAddBtn = false;
        $scope.resFormatOtherShow = false;
        $scope.resItemUpdateBtn = false;
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

    $scope.shareFreqSelection = [];
    $scope.toggleShareFreqSelection = function(item) {
      var idx = $scope.shareFreqSelection.indexOf(item.id);
      // is currently selected
      if (idx > -1) {
        $scope.shareFreqSelection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.shareFreqSelection.push(item.id);
      }
    };



    $scope.toggleShareFreqItemSelection = function(item) {
      //var shareFreqItemSelectionIds = _.map($scope.shareFreqItemSelection, 'id');
      var idx = $scope.shareFreqItemSelection.indexOf(item.id);
      console.log(idx);
      // is currently selected
      if (idx > -1) {
        $scope.shareFreqItemSelection.splice(idx, 1);
        $scope.shareFreqItemObjSelection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.shareFreqItemSelection.push(item.id);
        $scope.shareFreqItemObjSelection.push(item);
      }
      console.log($scope.shareFreqItemObjSelection);
    };


  }

])


/* HTTP */
DInventory.factory('Department.Inventory.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function getDepartmentList() {
      return $http.get(
        path + '/sys_dep'
      )
    }

    function getDepartInfoResList(params) {
      return $http.get(
        path + '/info_resource_list', {
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

    function saveInfoResource(data) {
      return $http.post(
        path + '/info_resource', {
          data: data
        }
      )
    };

    function updateInfoResource(data) {
      return $http.put(
        path + '/info_resource', {
          data: data
        }
      )
    }

    function getItemList(params) {
      return $http.get(
        path + '/sys_dict', {
          params: params
        }
      )
    }

    function getSystemDictByCatagory(params) {
      return $http.get(
        path + '/sys_dict', {
          params: params
        }
      )
    };

    function deleteInfoResource(id) {
      return $http.put(
        path + '/data_quota_delete_flag', {
          data: id
        }
      )
    }
    return {
      saveInfoResource: saveInfoResource,
      getDepartmentList: getDepartmentList,
      getDepartInfoResList: getDepartInfoResList,
      getInfoResourceDetail: getInfoResourceDetail,
      getSystemDictByCatagory: getSystemDictByCatagory,
      deleteInfoResource: deleteInfoResource,
      updateInfoResource: updateInfoResource,
      getItemList: getItemList
    }
  }
]);



/* Component */
DInventory.service('Department.Inventory.Service.Component', ['$uibModal', '$state',
  function($uibModal, $state) {
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
    function popModal(scope, controller, type, templateUrl) {
      //scope.Modal.type = type;
      var modalInstance = $uibModal.open({
        animation: true,
        backdrop: 'static',
        templateUrl: templateUrl + '.html',
        controller: controller,
        size: 'lg',
        scope: scope
      });
      scope.Modal.confirm = function() {
        modalInstance.close(scope.Modal);
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


DInventory.directive('fileModel', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;
      scope.parentIvntObj = {};
      element.bind('change', function() {
        var rgx = /(xls|xlsx)/i;
        var fileSuffix = element[0].files[0].name;
        var ext = fileSuffix.substring(fileSuffix.lastIndexOf(".") + 1);
        if (!rgx.test(ext)) {
          scope.$apply(function() {
            scope.parentIvntObj.fileNameError = true;
          })

        } else {
          scope.parentIvntObj.fileNameError = false;
          scope.$apply(function() {
            modelSetter(scope, element[0].files[0]);
          });
        }

      });
    }
  };
}]);
