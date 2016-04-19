'use strict';
var DInventory = angular.module('Department.Inventory', ['ui.router']);

/** Inventory Controller */
DInventory.controller('Department.Inventory.Controller.Main', ['$scope', '$q', 'Department.Inventory.Service.Http',
  function($scope, $q, Http) {
    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    // init
    getDepartmentInvntList(_httpParams);

    // Http.getAuditTotal().then(function(result) {
    //   $scope.depIvntList = result.data.body[0].NUMBER;
    // });

    Http.getShareLevelFilter().then(function(result) {
      $scope.shareLevelList = result.data.body;
    });

    Http.getSpatialFilter().then(function(result) {
      $scope.areaPeriodList = result.data.body;
    });


    function getDepartmentInvntList(_httpParams) {
      Http.getDepartInvntList(_httpParams).then(function(result){
        $scope.auditList = result.data.body;
      //  $scope.Paging.totalItems = data.head.total;
      });
    }

    // filter by share level
    $scope.shareLvSelection = [];
    $scope.getIvntListBySl = function(item) {
      var idx = $scope.shareLvSelection.indexOf(item.SYS_DICT_ID);
      if (idx > -1) {
        $scope.shareLvSelection.splice(idx, 1);
      }
      else {
        $scope.shareLvSelection = item.SYS_DICT_ID;
      }
      _httpParams.SHARE_LEVEL = item.SYS_DICT_ID;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentInvntList(_httpParams);
    }

    // filter by partial
    $scope.areaSelection = [];
    $scope.getIvntListByAP = function(item) {
      var idx = $scope.areaSelection.indexOf(item.SYS_DICT_ID);
      // is currently selected
      if (idx > -1) {
        $scope.areaSelection.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.areaSelection.push(item.SYS_DICT_ID);
      }
      console.log($scope.areaSelection);

      _httpParams.AREA_DATA_LEVEL = $scope.areaSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentInvntList(_httpParams);
    }

    // share level all
    $scope.getShareLevelAll = function() {
      $scope.shareLvSelection = [];
      _httpParams.SHARE_LEVEL = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentInvntList(_httpParams);
    }

    // get spatial all
    $scope.getSpatialAll = function() {
      $scope.areaSelection = [];
      _httpParams.AREA_DATA_LEVEL = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentInvntList(_httpParams);
    }


  }
])

DInventory.controller('Department.Inventory.Controller.publish', ['$rootScope', '$scope', '$q', '$uibModal', 'Department.Inventory.Service.Component', 'Department.Inventory.Service.Http',
  function($rootScope, $scope, $q, $uibModal, Component, Http) {
    $scope.step1 = {};
    $scope.step2 = {};
    $scope.step3 = {};
    $scope.step4 = {};
    $scope.step1.show = true;
    $scope.step2.show = false;
    $scope.step3.show = false;
    $scope.step4.show = false;
    $scope.progress = 25;
    $scope.loginUser = $rootScope.User;


    const SHARE_FREQUENCY = 1;
    const DATA_LEVEL = 2;
    const SHARE_LEVEL = 3;
    const QUOTA_TYPE = 4;
    const DATA_SHOW_FORMAT = 6;
    const SECRET_FLAG = 5;
    const LEVEL_AUTH = '250375bd-02f0-11e6-a52a-5cf9dd40ad7e';
    $scope.inventoryAttrList = [];
    $scope.DataExamps = [];

    $scope.exampTitles = [];

    $scope.submitObject = {};

    Date.prototype.format = function(fmt) { //author: meizz
      var o = {
        "%m": this.getMonth() + 1 + '', //月份
        "%d": this.getDate() + '', //日
        "%H": this.getHours() + '', //小时
        "%M": this.getMinutes() + '', //分
        "%S": this.getSeconds() + '', //秒
        //"q+" : Math.floor((this.getMonth()+3)/3), //季度
      };
      // 年份  2015
      if (/(%Y)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + ""));

      // 两位年份  15
      if (/(%y)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(2));

      //getTime返回的是以毫秒为单位的，转为秒
      if (/(%s)/.test(fmt))
      //fmt=fmt.replace(RegExp.$1, this.getTime()/1);
        fmt = fmt.replace(RegExp.$1, (this.getTime() + '').slice(0, 10));

      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (o[k].length == 2 ? o[k] : '0' + o[k]));
        }
      return fmt;
    }

    // init
    $scope.shareFreqSelection = [];
    $scope.dataLevelSelection = [];
    $scope.shareFreqArrShow = [];
    // toggle selection for a given item by name
    $scope.toggleShareFreqSelection = function toggleShareFreqSelection(itemId, itemName) {
      var idx = $scope.shareFreqSelection.indexOf(itemId);

      // is currently selected
      if (idx > -1) {
        $scope.shareFreqSelection.splice(itemId, 1);
        $scope.shareFreqArrShow.splice(itemName, 1);
      }

      // is newly selected
      else {
        $scope.shareFreqSelection.push(itemId);
        $scope.shareFreqArrShow.push(itemName);
      }
    };

    $scope.Modal = {};
    $scope.Modal.Quota = {};
    $scope.Modal.Quota.dataLevelSelection = [];

    $scope.toggleDataLevelSelection = function toggleDataLevelSelection(item) {
      var idx = $scope.dataLevelSelection.indexOf(item.ID);
      var idxModal = $scope.Modal.Quota.dataLevelSelection.indexOf(item.DICT_NAME);
      // is currently selected
      if (idx > -1) {
        $scope.dataLevelSelection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.dataLevelSelection.push(item.ID);
      }

      if (idxModal > -1) {
        $scope.Modal.Quota.dataLevelSelection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.Modal.Quota.dataLevelSelection.push(item.DICT_NAME);
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
      $scope.deptListModal = result.data.body;
    });

    // show or hide department
    $scope.depShow = false;
    $scope.depShowModal = false;
    $scope.showHideDeps = function(ev) {
      if (LEVEL_AUTH == $scope.dataInfo.shareLevel) {
        $scope.depShow = true;
      } else {
        $scope.depShow = false;
      }
      if ('授权开放' == $scope.Modal.Quota.shareLevel) {
        $scope.depShowModal = true;
      } else {
        $scope.depShowModal = false;
      }
      console.log($scope.depShow);
    }


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
        if ($scope.dataInfo.shareLevel == LEVEL_AUTH) { // 指定部门开放
          shareDeps = _.map($scope.outputDeptList, 'ID');
        }
        if (shareDeps.length == 0) {
          shareDeps = "0";
        }

        $scope.dataInfo.publishTime = $scope.dataInfo.publishTime.format('%Y-%m-%d');

        $scope.dataInfo = _.assign($scope.dataInfo, {
          'shareDeps': shareDeps
        }, {
          'depId': $rootScope.User.DEP_ID
        });

        $scope.step1_data = _.assign({
          'dataInfo': $scope.dataInfo
        }, {
          'dataInfoAddConfigs': data_info_add_configs
        });

        window.console.log($scope.step1_data);
      }
    };

    // pop add attribute modal
    $scope.popAttrAddModal = function() {
      $scope.Modal = {}; // Clean scope of modal
      $scope.Modal.Quota = {}; // Clean scope of modal
      $scope.Modal.Quota.dataLevelSelection = [];

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
        var shareDeps = [];
        if ($scope.Modal.Quota.shareLevel == LEVEL_AUTH) { // 指定部门开放
          shareDeps = _.map($scope.outputModalDeptList, 'ID');
        }
        if (shareDeps.length == 0) {
          shareDeps = "0";
        }

        // format areaDataLevel to string
        var areaDataLevelStr = '';
        _.forEach($scope.Modal.Quota.dataLevelSelection,function(value) {
            areaDataLevelStr = areaDataLevelStr + value + ",";
        })

        var invntModalData = _.assign({
          "areaDataLevel": areaDataLevelStr
        }, {
          "shareDeps": shareDeps
        }, $scope.Modal.Quota);

        $scope.inventoryAttrList.push(invntModalData);

        $scope.step2_data = {};
        $scope.dataQuota = [];


        _.forEach($scope.inventoryAttrList, function(item, index) {
          item.dataLevelSelection = null;
          var step2_obj = _.assign({
            'dataInfoId': $scope.dataInfo.dataName
          }, item, {
            'showOrder': index + 1
          });
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
        _.forEach($scope.step2_data.dataQuota, function(item, index) {
          var dataObj = _.assign({
            'rowKey': item.showOrder
          }, {
            'dataQuotaValue': item.dataValue
          }, {
            'dataQuotaId': item.quotaName
          })
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
        _.assign({
          'dataInfoId': $scope.dataInfo.dataName
        }, $scope.DataOtherInfo);

      $scope.submitObject = _.assign($scope.step1_data, $scope.step2_data, $scope.step3_data, $scope.step4_data);

      console.log($scope.submitObject);
      // $scope.submitObject.dataLevelSelection = null;
      Http.saveInventory($scope.submitObject).then(function(result) {
        console.log(result.data.head);
        if (200 == result.data.head.status) {
          alert('添加成功');
        }
      })
    }

    // Datepicker
    $scope.popup2 = {
      opened: false
    };
    $scope.openDatePicker = function() {
      $scope.popup2.opened = true;
    };
  }
])

/* HTTP */
DInventory.factory('Department.Inventory.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function saveInventory(data) {
      return $http.post(
        path + '/inventory', {
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

    function getDepartInvntList(params) {
      return $http.get(
        path + '/inventory/inventoryListByDep' ,
        {params: params}
      )
    }
    function getShareLevelFilter(params) {
      return $http.get(
        path + '/openInventory/countByShareLevel',
        {
          params:params
        }
      )
    }

    function getSpatialFilter(params) {
      return $http.get(
        path + '/openInventory/countBySpatial',
        {
          params:params
        }
      )
    }
    return {
      saveInventory: saveInventory,
      getSystemDictByCatagory: getSystemDictByCatagory,
      getDepartmentList: getDepartmentList,
      getDepartInvntList: getDepartInvntList,
      getShareLevelFilter: getShareLevelFilter,
      getSpatialFilter: getSpatialFilter
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
