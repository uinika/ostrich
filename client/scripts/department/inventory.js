'use strict';
var DInventory = angular.module('Department.Inventory', ['ui.router']);

/** Inventory Controller */
DInventory.controller('Department.Inventory.Controller.Main', ['$scope', '$q', 'Department.Inventory.Service.Http',
  function($scope, $q, Http) {
    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    // Http.getShareLevelFilter().then(function(result) {
    //   $scope.shareLevelList = result.data.body;
    // });
    //
    // Http.getSpatialFilter().then(function(result) {
    //   $scope.areaPeriodList = result.data.body;
    // });

    // init
    // getDepartmentInvntList(_httpParams);
    //
    // Http.getInventoryDepTotal().then(function(result) {
    //   $scope.ivntDepTotal = result.data.body[0].INVENTORY_NUM;
    //   $scope.depName = result.data.body[0].DEP_NAME;
    // });
    //

    //
    //
    // function getDepartmentInvntList(_httpParams) {
    //   Http.getDepartInvntList(_httpParams).then(function(result) {
    //     $scope.depIvntList = result.data.body;
    //     //  $scope.Paging.totalItems = data.head.total;
    //   });
    // }
    //
    // // filter by share level
    // $scope.shareLvMainSelection = [];
    // $scope.getIvntListBySl = function(item) {
    //   var idx = $scope.shareLvMainSelection.indexOf(item.SYS_DICT_ID);
    //   if (idx > -1) {
    //     $scope.shareLvMainSelection = [];
    //   } else {
    //     $scope.shareLvMainSelection = item.SYS_DICT_ID;
    //   }
    //   _httpParams.SHARE_LEVEL = $scope.shareLvMainSelection;
    //   _httpParams.limit = 10;
    //   _httpParams.skip = 0;
    //   getDepartmentInvntList(_httpParams);
    // }
    //
    // // filter by partial
    // $scope.areaMainSelection = [];
    // $scope.getIvntListByAP = function(item) {
    //   var idx = $scope.areaMainSelection.indexOf(item.DICTID);
    //   // is currently selected
    //   if (idx > -1) {
    //     $scope.areaMainSelection.splice(idx, 1);
    //   }
    //   // is newly selected
    //   else {
    //     $scope.areaMainSelection.push(item.SYS_DICT_ID);
    //   }
    //   console.log($scope.areaMainSelection);
    //
    //   _httpParams.AREA_DATA_LEVEL = $scope.areaMainSelection;
    //   _httpParams.limit = 10;
    //   _httpParams.skip = 0;
    //   getDepartmentInvntList(_httpParams);
    // }
    //
    // // share level all
    // $scope.getShareLevelAll = function() {
    //   $scope.shareLvMainSelection = [];
    //   _httpParams.SHARE_LEVEL = null;
    //   _httpParams.limit = 10;
    //   _httpParams.skip = 0;
    //   getDepartmentInvntList(_httpParams);
    // }
    //
    // // get spatial all
    // $scope.getSpatialAll = function() {
    //   $scope.areaMainSelection = [];
    //   _httpParams.AREA_DATA_LEVEL = null;
    //   _httpParams.limit = 10;
    //   _httpParams.skip = 0;
    //   getDepartmentInvntList(_httpParams);
    // }


  }
])

DInventory.controller('Department.Inventory.Controller.publish', ['$rootScope', '$scope', '$state', '$q', '$uibModal', 'Department.Inventory.Service.Component', 'Department.Inventory.Service.Http',
  function($rootScope, $scope, $state, $q, $uibModal, Component, Http) {
    var SHARE_FREQUENCY = 1;
    var DATA_LEVEL = 2;
    var SHARE_LEVEL = 3;
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

    // Get system dict
    Http.getSystemDictByCatagory({
      'dict_category': SHARE_FREQUENCY
    }).then(function(result) {
      console.log(result.data.body);
      $scope.shareFrequencyList = result.data.body;
      console.log($scope.shareFrequencyList);
    });

    Http.getSystemDictByCatagory({
      'dict_category': DATA_LEVEL
    }).then(function(result) {
      $scope.dataLevelList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': SHARE_LEVEL
    }).then(function(result) {
      $scope.shareLevelList = result.data.body;
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
      var dataQuotaShareDep = [];
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
          share_dep.dep_id = value;
          dataQuotaShareDep.push(share_dep);
        });

        DataQuotaAddObj.dataRelationConfig = dataRelationConfig;
        DataQuotaAddObj.dataQuotaShareDep = dataQuotaShareDep;

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
    $scope.toggleDataLevelSelection = function toggleDataLevelSelection(item) {
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



    // $scope.step1 = {};
    // $scope.step2 = {};
    // $scope.step3 = {};
    // $scope.step4 = {};
    // $scope.step1.show = true;
    // $scope.step2.show = false;
    // $scope.step3.show = false;
    // $scope.step4.show = false;
    // $scope.loginUser = $rootScope.User;
    //
    //
    //
    // $scope.inventoryAttrList = [];
    // $scope.DataExamps = [];
    //
    // $scope.exampTitles = [];
    //
    // $scope.submitObject = {};
    //
    // Date.prototype.format = function(fmt) { //author: meizz
    //   var o = {
    //     "%m": this.getMonth() + 1 + '', //月份
    //     "%d": this.getDate() + '', //日
    //     "%H": this.getHours() + '', //小时
    //     "%M": this.getMinutes() + '', //分
    //     "%S": this.getSeconds() + '', //秒
    //     //"q+" : Math.floor((this.getMonth()+3)/3), //季度
    //   };
    //   // 年份  2015
    //   if (/(%Y)/.test(fmt))
    //     fmt = fmt.replace(RegExp.$1, (this.getFullYear() + ""));
    //
    //   // 两位年份  15
    //   if (/(%y)/.test(fmt))
    //     fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(2));
    //
    //   //getTime返回的是以毫秒为单位的，转为秒
    //   if (/(%s)/.test(fmt))
    //   //fmt=fmt.replace(RegExp.$1, this.getTime()/1);
    //     fmt = fmt.replace(RegExp.$1, (this.getTime() + '').slice(0, 10));
    //
    //   for (var k in o)
    //     if (new RegExp("(" + k + ")").test(fmt)) {
    //       fmt = fmt.replace(RegExp.$1, (o[k].length == 2 ? o[k] : '0' + o[k]));
    //     }
    //   return fmt;
    // }
    //
    // // init
    // $scope.shareFreqSelection = [];
    // $scope.dataLevelSelection = [];
    // $scope.shareFreqArrShow = [];
    //
    // $scope.Modal = {};
    // $scope.Modal.Quota = {};
    // $scope.Modal.Quota.dataLevelSelection = [];
    //

    //
    // Http.getDepartmentList().then(function(result) {
    //   $scope.deptList = result.data.body;
    //   $scope.deptListModal = result.data.body;
    // });
    //
    //
    //
    //
    // $scope.backToStep1 = function() {
    //   $scope.step1.show = true;
    //   $scope.step2.show = false;
    // }
    //
    // $scope.toStep3 = function() {
    //   if (!$scope.inventoryAttrList || $scope.inventoryAttrList.length == 0) {
    //     alert('请先添加指标属性！');
    //     return;
    //   }
    //   $scope.step3.show = true;
    //   $scope.step2.show = false;
    //
    //   $scope.DataExamps = $scope.inventoryAttrList;
    // }
    //
    // $scope.backToStep2 = function() {
    //   $scope.step2.show = true;
    //   $scope.step3.show = false;
    // }
    //
    // $scope.toStep4 = function() {
    //   if (!$scope.ExampDatas || $scope.ExampDatas.length == 0) {
    //     alert('请先添加示例数据！');
    //     return;
    //   }
    //   $scope.step4.show = true;
    //   $scope.step3.show = false;
    //
    //
    // }
    //
    // $scope.backToStep3 = function() {
    //   $scope.step3.show = true;
    //   $scope.step4.show = false;
    // }
    //
    // $scope.toStep2 = function(isValid) {
    //   if (isValid) {
    //     $scope.step2.show = true;
    //     $scope.step1.show = false;
    //
    //     $scope.step1_data = {};
    //     var data_info_add_configs = [];
    //
    //
    //     var sys_dicts = _.union($scope.shareFreqSelection, $scope.dataLevelSelection);
    //     _(sys_dicts).forEach(function(value) {
    //       var sys_dict = {};
    //       sys_dict.dataInfoId = $scope.dataInfo.dataName
    //       sys_dict.sysDictId = value;
    //       data_info_add_configs.push(sys_dict);
    //     });
    //
    //     var shareDeps = [];
    //     if ($scope.dataInfo.shareLevel == LEVEL_AUTH) { // 指定部门开放
    //       shareDeps = _.map($scope.outputDeptList, 'ID');
    //     }
    //     if (shareDeps.length == 0) {
    //       shareDeps = "0";
    //     }
    //
    //     $scope.dataInfo.publishTime = $scope.dataInfo.publishTime.format('%Y-%m-%d');
    //
    //     console.log($scope.dataInfo.areaPeriod);
    //     $scope.dataInfo = _.assign($scope.dataInfo, {
    //       'shareDeps': shareDeps
    //     }, {
    //       'depId': $rootScope.User.DEP_ID
    //     });
    //
    //     $scope.step1_data = _.assign({
    //       'dataInfo': $scope.dataInfo
    //     }, {
    //       'dataInfoAddConfigs': data_info_add_configs
    //     });
    //
    //     window.console.log($scope.step1_data);
    //   }
    // };
    //
    // // pop add attribute modal
    // $scope.popAttrAddModal = function() {
    //   $scope.Modal = {}; // Clean scope of modal
    //   $scope.Modal.Quota = {}; // Clean scope of modal
    //   $scope.Modal.Quota.dataLevelSelection = [];
    //
    //   // Get system dict
    //   Http.getSystemDictByCatagory({
    //     'DICT_CATEGORY': DATA_STORE_TYPE
    //   }).then(function(result) {
    //     $scope.quotaTypeList = result.data.body;
    //   });
    //   Http.getSystemDictByCatagory({
    //     'DICT_CATEGORY': DATA_SHOW_FORMAT
    //   }).then(function(result) {
    //     $scope.dataShowFormatList = result.data.body;
    //   });
    //   Http.getSystemDictByCatagory({
    //     'DICT_CATEGORY': SECRET_FLAG
    //   }).then(function(result) {
    //     $scope.secretFlagList = result.data.body;
    //   });
    //
    //
    //   Component.popModal($scope, '添加', 'add-indicator-modal').result.then(function() {
    //     var shareDeps = [];
    //     if ($scope.Modal.Quota.shareLevel == LEVEL_AUTH) { // 指定部门开放
    //       shareDeps = _.map($scope.outputModalDeptList, 'ID');
    //     }
    //     if (shareDeps.length == 0) {
    //       shareDeps = "0";
    //     }
    //
    //     // format areaDataLevel to string
    //     var areaDataLevelStr = '';
    //     _.forEach($scope.Modal.Quota.dataLevelSelection, function(value) {
    //       areaDataLevelStr = areaDataLevelStr + value + ",";
    //     })
    //
    //     var invntModalData = _.assign({
    //       "areaDataLevel": areaDataLevelStr
    //     }, {
    //       "shareDeps": shareDeps
    //     }, {
    //       "createTime": new Date()
    //     }, $scope.Modal.Quota);
    //
    //     $scope.inventoryAttrList.push(invntModalData);
    //
    //     $scope.step2_data = {};
    //     $scope.dataQuota = [];
    //
    //
    //     _.forEach($scope.inventoryAttrList, function(item, index) {
    //       item.dataLevelSelection = null;
    //       var step2_obj = _.assign({
    //         'dataInfoId': $scope.dataInfo.dataName
    //       }, item, {
    //         'showOrder': index + 1
    //       });
    //       $scope.dataQuota.push(step2_obj);
    //     });
    //     $scope.step2_data.dataQuota = $scope.dataQuota;
    //   });
    // }
    //
    // $scope.ExampDatas = [];
    // $scope.dataCells = [];
    // $scope.step3_data = {};
    // $scope.addExampData = function() {
    //   $scope.ExampModal = {}; // Clean scope of modal
    //   $scope.ExampModal.ExampData = {}; // Clean scope of modal
    //
    //   $scope.rowDatas = [];
    //
    //
    //   Component.popModal($scope, '添加', 'add-example-modal').result.then(function() {
    //     window.console.log($scope.step2_data.dataQuota);
    //     _.forEach($scope.step2_data.dataQuota, function(item, index) {
    //       var dataObj = _.assign({
    //         'rowKey': item.showOrder
    //       }, {
    //         'dataQuotaValue': item.dataValue
    //       }, {
    //         'dataQuotaId': item.quotaName
    //       })
    //       $scope.rowDatas.push(dataObj);
    //       $scope.dataCells.push(dataObj);
    //     })
    //     $scope.ExampDatas.push($scope.rowDatas);
    //
    //     $scope.step3_data.dataExamples = $scope.dataCells;
    //   });
    // }
    //
    // // total submit
    // $scope.addFormSubmit = function() {
    //   $scope.step4_data = {};
    //   $scope.step4_data.dataOtherInfo =
    //     _.assign($scope.DataOtherInfo);
    //
    //   $scope.submitObject = _.assign($scope.step1_data, $scope.step2_data, $scope.step3_data, $scope.step4_data);
    //
    //   console.log($scope.submitObject);
    //   // $scope.submitObject.dataLevelSelection = null;
    //   Http.saveInventory($scope.submitObject).then(function(result) {
    //     console.log(result.data.head);
    //     if (200 == result.data.head.status) {
    //       alert('新增成功');
    //       //$state.go("main.department.inventory",{}, { reload: true });
    //       Component.popModal($scope, '添加', 'import-example-modal').result.then(function() {
    //
    //       });
    //     }
    //   })
    // }

    // Datepicker
    // $scope.popup2 = {
    //   opened: false
    // };
    // $scope.openDatePicker = function() {
    //   $scope.popup2.opened = true;
    // };
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


    function saveDataQuota(data) {
      return $http.post(
        path + '/data_quota', {
          data: data
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
    return {
      saveDataQuota: saveDataQuota,
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
