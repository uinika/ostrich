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
      _httpParams.dep_name = DEP_NAME;
      $scope.promise = Http.getDepartQuotaList(_httpParams).then(function(result) {
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
      _httpParams.resource_format = null;
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
      _httpParams.share_frequency = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // secret flag all
    $scope.getSecretFlagAll = function() {
      $scope.secretFlagMainSelection = [];
      _httpParams.secret_flag = null;
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
      _httpParams.resource_format = $scope.resFormatMainSelection;
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
      _httpParams.share_frequency = $scope.shareFreqSelection;
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
      var idx = $scope.socialOpenMainSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.socialOpenMainSelection = [];
      } else {
        $scope.socialOpenMainSelection = item.id;
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
      _httpParams.secret_flag = $scope.secretFlagMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }


    // get spatial all
    $scope.getSpatialAll = function() {
      $scope.areaMainSelection = [];
      _httpParams.sys_dict_id = null;
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

      _httpParams.sys_dict_id = $scope.areaMainSelection;
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
    Http.getQuotaDetail({
      data_quota_id: $stateParams.ID
    }).then(function(result) {
      $scope.DataQuotaDetail = result.data.body[0];
      Http.getQuotaExamples({
        dataquotaid: $stateParams.ID
      }).then(function(res) {
        $scope.DataQuotaExamples = res.data.body[0];
        $scope.DataTitle = $scope.DataQuotaExamples.file_content.title;
        $scope.DataColumn = $scope.DataQuotaExamples.file_content.column;
        console.log($scope.DataTitle);
        console.log($scope.DataColumn);
      })
    })
  }
])

DInventory.controller('Department.Inventory.Controller.publish', ['$cookies', '$scope', '$state', '$q', '$uibModal', 'Department.Inventory.Service.Component', 'Department.Inventory.Service.Http',
  function($cookies, $scope, $state, $q, $uibModal, Component, Http) {
    var RESOURCE_CATEGORY = 10;
    var SHARE_TYPE = 12;
    var SHARE_METHOD = 13;
    var ITEM_TYPE = 15;
    var LEVEL_AUTH = '250375bd-02f0-11e6-a52a-5cf9dd40ad7e';
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
      $scope.submitted = false;
      var InfoResourceAddObj = {};
      var InfoResource_RelationConfig = [];
      var InfoResourceApplyInfo = [];
      var InfoItem_RelationConfig = [];

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
        _($scope.ResourceItemList).forEach(function(item,index) {
          console.log(index);
          item.item_ord = index;
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
        $scope.submitted = true;
      }
    }

    $scope.addResourceItem = function() {
      $scope.Modal = {};
      $scope.ResourceItem = {};
      $scope.shareFreqItemSelection = [];
      $scope.shareFreqItemObjSelection = [];
      Component.popModal($scope, 'Department.Inventory.Controller.publish', '', 'item-add-modal').result.then(function(res) {
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
      if (LEVEL_AUTH == $scope.InfoResource.share_level) {
        $scope.depShow = true;
        $scope.socialOpenFlag = false;
      } else {
        $scope.depShow = false;
        $scope.InfoResource.social_open_flag = 0;
        $scope.socialOpenFlag = true;
      }
    }

    $scope.shareMethodOtherShow = false;
    $scope.showHideShareMethodOther = function() {
      if(SHARE_METHOD_OTHER == $scope.InfoResource.share_method) {
        $scope.shareMethodOtherShow = true;
      }
      else {
        $scope.shareMethodOtherShow = false;
      }
    }

    //show or hide resource item add button
    $scope.resItemAddBtn = false;
    $scope.resFormatOtherShow = false;
    $scope.showHideResAddBtn = function() {
      $scope.resFormatOtherShow = false;
      if (RESOURCE_FORMAT_DATA == $scope.InfoResource.resource_format) {
        $scope.resItemAddBtn = true;
        $scope.resFormatOtherShow = false;
      }
      else if(RESOURCE_FORMAT_OTHER == $scope.InfoResource.resource_format) {
        $scope.resFormatOtherShow = true;
        $scope.resItemAddBtn = false;
      }
      else {
        $scope.resItemAddBtn = false;
        $scope.resFormatOtherShow = false;
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
        $scope.shareFreqItemObjSelection.splice(idx,1);
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

// upload file
DInventory.controller('Department.Inventory.Controller.upload', ['$scope', '$q', 'Department.Inventory.Service.Http', '$stateParams', '$state', '$sce',
    function($scope, $q, Http, $stateParams, $state, $sce) {
      $scope.uploadPromise = null;

      $scope.htmlPopover = $sce.trustAsHtml("<table class='table table-hover table-striped '>" +
        "<thead><tr><th>序号</th><th>城市</th><th>GDP(亿元)</th><th>增长</th>" +
        "<th>地方公共财政收入(亿元)</th><th>增长</th><th>城镇登记失业率</th>" +
        "<th>农村居民人均纯收入(元)</th><th>增长</th></tr></thead>" +
        "<tbody><tr><td>1</td><td>成都</td><td>9000</td><td>8.54%</td><td>8000</td><td>7.51%</td>" +
        "<td>1.39</td><td>5678</td><td>3.40%</td></tr>" +
        "</tbody></table>");

      $scope.uploadFile = function() {
        var file = $scope.myFile;
        console.log('file is ');
        console.dir(file);
        if (!file) {
          alert('您还未选择文件');
          return;
        }
        $scope.uploadPromise = Http.uploadFile(file, $stateParams.ID).then(function(result) {
          if (200 == result.data.head.status) {
            alert('上传成功!');
            $state.go("main.department.inventory", {}, {
              reload: true
            });
          }
        });
      }

      $scope.toIndex = function() {
        $state.go("main.department.inventory", {}, {
          reload: true
        });
      }
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

    function saveInfoResource(data) {
      return $http.post(
        path + '/info_resource', {
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

    function getQuotaExamples(params) {
      return $http.get(
        path + '/examples_detail', {
          params: params
        }
      )
    }

    function uploadFile(file, id) {
      var fd = new FormData();
      var uploadUrl = path + '/upload/excel?data_quota_id=' + id;
      fd.append('file', file);
      var promise = $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      });
      return promise;
    }

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
      getDepartQuotaList: getDepartQuotaList,
      getQuotaDetail: getQuotaDetail,
      getSystemDictByCatagory: getSystemDictByCatagory,
      uploadFile: uploadFile,
      getQuotaExamples: getQuotaExamples,
      deleteInfoResource: deleteInfoResource
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
