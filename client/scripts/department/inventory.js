'use strict';
var DInventory = angular.module('Department.Inventory', ['ui.router', 'ngCookies', 'cgBusy']);

/** Inventory Controller */
DInventory.controller('Department.Inventory.Controller.Main', ['$cookies', '$scope', '$q', 'Department.Inventory.Service.Http',
  function($cookies, $scope, $q, Http) {
    var LoginUser = JSON.parse($cookies.get('User'));
    var DEP_NAME = LoginUser.dep_id;
    $scope.DepartDataQuota = {};

    $scope.Paging = {};
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    $scope.Paging.pageChanged = function() {
      _httpParams.skip = ($scope.Paging.currentPage - 1)*_httpParams.limit;
      getDepartmentQuotaList(_httpParams);
    }

    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '加载中...';
    $scope.backdrop = true;
    $scope.promise = null;

    function getDepartmentQuotaList(_httpParams) {
      _httpParams.dep_name = DEP_NAME;
      $scope.promise = Http.getDepartQuotaList(_httpParams).then(function(result) {
        console.log(result);
        var temp = _.replace('  Hi', ' ', '0');
        console.log(temp);
        $scope.depQuotaList = result.data.body[0].results;
        $scope.Paging.totalItems = result.data.body[0].count;
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
    var DATA_STORE_TYPE = 4;
    var DATA_SHOW_FORMAT = 6;
    var SECRET_FLAG = 5;
    var LEVEL_AUTH = '250375bd-02f0-11e6-a52a-5cf9dd40ad7e';
    var STORE_TYPE_OTHER = '25098ff3-02f0-11e6-a52a-5cf9dd40ad7e';
    var DATA_SHOW_OTHER = '2515e9b5-02f0-11e6-a52a-5cf9dd40ad7e';

    var LoginUser = JSON.parse($cookies.get('User'));
    var DEP_ID = LoginUser.dep_id;
    $scope.DEP_NAME = LoginUser.dep_name;
    $scope.DataQuota = {};
    $scope.DataQuota.data_show_format_add = '';
    $scope.DataQuota.data_store_type_add = '';
    $scope.DataQuota.calculate_method = '';
    $scope.DataQuota.linkman = '';
    $scope.DataQuota.contact_phone = '';
    $scope.DataQuota.file_name = '';


    Http.getDepartmentList().then(function(result) {
      $scope.deptList = result.data.body;
      var evens = _.remove($scope.deptList, function(item) {
        return item.id == DEP_ID;
      });
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

    $scope.close = function(isValid) {
      $state.go("main.department.inventory", {}, {
        reload: true
      });
    }

    // submit add
    $scope.addQuota = function(isValid) {
      $scope.submitted = false;
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
          sys_dict.obj_type = 1;
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
            console.log(result.data);
            if (200 == result.data.head.status) {
              $scope.Modal = {};

              var modalInstance = Component.popModal($scope, 'Department.Inventory.Controller.publish', '', 'import-example-modal').result.then(function(res) {
                $state.go("main.department.inventory.upload", {
                  ID: result.data.body[0].id
                }, {
                  reload: true
                });

              })

            }
            else{
              alert('保存失败');
              // $state.go("main.department.inventory", {}, {
              //   reload: true
              // });
            }
          })
          // .then(function() {
          //   $state.go("main.department.inventory", {}, {
          //     reload: true
          //   });
          // })
      }
      else{
        $scope.submitted = true;
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

// upload file
DInventory.controller('Department.Inventory.Controller.upload', ['$scope', '$q', 'Department.Inventory.Service.Http', '$stateParams', '$state', '$sce',
    function($scope, $q, Http, $stateParams, $state ,$sce) {
      $scope.uploadPromise = null;

      $scope.htmlPopover = $sce.trustAsHtml("<table class='table table-hover table-striped '>"+
        "<thead><tr><th>序号</th><th>城市</th><th>GDP(亿元)</th><th>增长</th>"+
        "<th>地方公共财政收入(亿元)</th><th>增长</th><th>城镇登记失业率</th>"+
        "<th>农村居民人均纯收入(元)</th><th>增长</th></tr></thead>"+
        "<tbody><tr><td>1</td><td>成都</td><td>9000</td><td>8.54%</td><td>8000</td><td>7.51%</td>"+
        "<td>1.39</td><td>5678</td><td>3.40%</td></tr>"+
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

    function deleteDataQuota(id) {
      return $http.put(
        path + '/data_quota_delete_flag', {
          data: id
        }
      )
    }
    return {
      saveDataQuota: saveDataQuota,
      getDepartmentList: getDepartmentList,
      getDepartQuotaList: getDepartQuotaList,
      getQuotaDetail: getQuotaDetail,
      getSystemDictByCatagory: getSystemDictByCatagory,
      uploadFile: uploadFile,
      getQuotaExamples: getQuotaExamples,
      deleteDataQuota: deleteDataQuota
    }
  }
]);



/* Component */
DInventory.service('Department.Inventory.Service.Component', ['$uibModal', '$state',
  function($uibModal,$state) {
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
        scope: scope
      });
      scope.Modal.confirm = function() {
        modalInstance.close(scope.Modal);
      };
      scope.Modal.cancel = function() {
        modalInstance.dismiss();
        setTimeout(function(){
          alert('保存成功！');
          $state.go("main.department.inventory", {}, {
            reload: true
          });
        },600)

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

      element.bind('change', function() {
        scope.$apply(function() {
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);
