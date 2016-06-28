'use strict';
var DepartmentReq = angular.module('Department.Requirement', ['ui.router']);

/** DepartmentReq Controller */
DepartmentReq.controller('Department.Requirement.Controller.Main', ['$cookies', '$scope', '$stateParams', 'Department.Requirement.Service.Component', 'Department.Requirement.Service.Http',
  function($cookies, $scope, $stateParams, Component, Http) {
    var LoginUser = JSON.parse($cookies.get('User'));
    var DEP_ID = LoginUser.dep_id;
    var SHARE_FREQUENCY = 1;
    var DATA_LEVEL = 2;
    $scope.DeptRequirement = {};

    $scope.Paging = {};
    $scope.Paging.currentPage = 1;
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    $scope.Paging.pageChanged = function() {
      _httpParams.skip = ($scope.Paging.currentPage - 1) * _httpParams.limit;
      getDeptRequirementList(_httpParams);
    }

    // init
    getDeptRequirementList();

    Http.getDepartmentList().then(function(result) {
      $scope.deptList = result.data.body;
      var evens = _.remove($scope.deptList, function(item) {
        return item.id == DEP_ID;
      });
    });

    Http.getSystemDictByCatagory({
      'dict_category': SHARE_FREQUENCY
    }).then(function(result) {
      $scope.shareFrequencyList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': DATA_LEVEL
    }).then(function(result) {
      $scope.dataLevelList = result.data.body;
    });

    function getDeptRequirementList() {
      _httpParams.dep_id = DEP_ID;
      $scope.reqPromise = Http.getDepartmentRequirementList(_httpParams).then(function(result) {
        $scope.requirementList = result.data.body[0].results;
        $scope.Paging.totalItems = result.data.body[0].count;
      })
    }


    $scope.toggleDataLevelReqSelection = function(item) {
      var idx = $scope.dataLevelReqSelection.indexOf(item.id);
      // is currently selected
      if (idx > -1) {
        $scope.dataLevelReqSelection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.dataLevelReqSelection.push(item.id);
      }
    };


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



    $scope.publishReq = function() {
      $scope.Modal = {};
      $scope.Modal.DepRequirment = {};

      var _httpPublishParams = {};
      var dataRelationConfig = [];
      $scope.reqParent = {};
      $scope.reqParent.outputDeptList = [];

      $scope.shareFreqSelection = [];
      $scope.dataLevelReqSelection = [];

      $scope.error = false;
      $scope.submitted = false;

      Component.popModal($scope, '发布', 'add-req-modal').result.then(function() {
        _($scope.dataLevelReqSelection).forEach(function(value) {
          var req_sys_dict = {};
          req_sys_dict.datarequiementId = $scope.Modal.DepRequirment.requiement_name;
          req_sys_dict.sys_dict_id = value;
          req_sys_dict.obj_type = 2;
          dataRelationConfig.push(req_sys_dict);
        });

        _($scope.shareFreqSelection).forEach(function(value) {
          var req_sys_dict = {};
          req_sys_dict.datarequiementId = $scope.Modal.DepRequirment.requiement_name;
          req_sys_dict.sys_dict_id = value;
          req_sys_dict.obj_type = 2;
          dataRelationConfig.push(req_sys_dict);
        });

        var res_dep_id = _.map($scope.reqParent.outputDeptList, 'id');

        console.log(res_dep_id);
        $scope.Modal.DepRequirment.response_dep_id = res_dep_id[0];
        _httpPublishParams.dataRequiement = $scope.Modal.DepRequirment;
        _httpPublishParams.dataRelationConfig = dataRelationConfig;

        Http.publishRequirement(_httpPublishParams).then(function(result) {
          if (200 == result.data.head.status) {
            alert('发布成功');
          } else {
            alert('发布失败');
          }
          getDeptRequirementList();
        })
      });
    }

    $scope.searchDeptReqByName = function() {
      _httpParams.requiement_name = $scope.DeptRequirement.req_name_filter;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptRequirementList();
    }


    // delete requirement
    $scope.deleteReq = function(id) {
      var deleteFlag = confirm('确定删除本条需求？删除后将不可恢复。');
      if (deleteFlag) {
        Http.deleteRequirement({
          requiement_id: id
        }).then(function(result) {
          if (200 == result.data.head.status) {
            alert('删除成功！');
            getDeptRequirementList();
          } else {
            alert('删除失败！');
          }
        })
      }
    }

    // update requirement
    $scope.updateReq = function(item) {
      $scope.Modal = {};
      $scope.Modal.DepRequirment = item;

      var _httpPublishParams = {};
      var dataRelationConfig = [];

      $scope.reqParent = {};
      $scope.reqParent.outputDeptList = [];

      $scope.shareFreqSelection = [];
      $scope.dataLevelReqSelection = [];

      _($scope.deptList).forEach(function(outItem) {
        if (item.response_dep_id == outItem.id) {
          outItem.ticked = true;
          $scope.reqParent.outputDeptList.push(outItem);
        }
      })

      // 获取需求对应的共享频率数据
      Http.getReqUpdatePeriod({
        requiement_id: item.id
      }).then(function(res) {
        $scope.shareFreqSelection = res.data.body[0].id;
      })

      // 获取需求对应的分地区数据级别
      Http.getReqAreaLevel({
        requiement_id: item.id
      }).then(function(res) {
        $scope.dataLevelReqSelection = res.data.body[0].id;
      })

      $scope.error = false;
      Component.popModal($scope, '修改', 'add-req-modal').result.then(function() {
        _($scope.dataLevelReqSelection).forEach(function(value) {
          var req_sys_dict = {};
          req_sys_dict.datarequiementId = $scope.Modal.DepRequirment.id;
          req_sys_dict.sys_dict_id = value;
          req_sys_dict.obj_type = 2;
          dataRelationConfig.push(req_sys_dict);
        });

        _($scope.shareFreqSelection).forEach(function(value) {
          var req_sys_dict = {};
          req_sys_dict.datarequiementId = $scope.Modal.DepRequirment.id;
          req_sys_dict.sys_dict_id = value;
          req_sys_dict.obj_type = 2;
          dataRelationConfig.push(req_sys_dict);
        });

        var res_dep_id = _.map($scope.reqParent.outputDeptList, 'id');
        $scope.Modal.DepRequirment.response_dep_id = res_dep_id[0];

        _httpPublishParams.dataRequiement = $scope.Modal.DepRequirment;
        _httpPublishParams.dataRelationConfig = dataRelationConfig;

        Http.updateRequirementInfo(_httpPublishParams).then(function(result) {
          if (200 == result.data.head.status) {
            alert('修改成功');
          } else {
            alert('修改失败');
          }
          getDeptRequirementList();
        })
      });
    }

    // 根据确认状态过滤
    $scope.filterByConfirmStatus = function(status) {
      _httpParams.requiement_status = status;
      getDeptRequirementList();
    }



  }
])


/** DepartmentReq Controller */
DepartmentReq.controller('Department.Requirement.Controller.confirm', ['$cookies', '$scope', '$stateParams', 'Department.Requirement.Service.Http', 'Department.Requirement.Service.Component',
  function($cookies, $scope, $stateParams, Http, Component) {
    var RESOURCE_FORMAT = 11;
    $scope.closeShow = false;
    $scope.showIndex = -1;

    $scope.resParent = {};
    $scope.resParent.dropListShow = false;

    $scope.Modal = {};
    $scope.DeptRequirementConfirm = {};

    var LoginUser = JSON.parse($cookies.get('User'));
    var DEP_ID = LoginUser.dep_id;
    $scope.DeptRequirement = {};

    $scope.Paging = {};
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    // 模态框信息资源列表分页
    $scope.ModalPaging = {};
    $scope.ModalPaging.maxSize = 5;
    $scope.ModalPaging.itemsPerPage = 10;

    var _httpConfirmParams = {};
    _httpConfirmParams.limit = 10;
    _httpConfirmParams.skip = 0;

    var _httpModalParams = {};
    _httpModalParams.limit = 10;
    _httpModalParams.skip = 0;

    $scope.Paging.pageChanged = function() {
      _httpConfirmParams.skip = ($scope.Paging.currentPage - 1) * _httpConfirmParams.limit;
      getDeptRequirementConfirmList(_httpConfirmParams);
    }

    // 模态框中信息资源分页
    $scope.ModalPaging.pageChanged = function() {
      _httpModalParams.skip = ($scope.ModalPaging.currentPage - 1) * _httpModalParams.limit;
      Http.getDeptInfoResourceList(_httpModalParams).then(function(result) {
        console.log(result);
        $scope.depInfoResourceList = result.data.body[0].results;
        $scope.ModalPaging.totalItems = result.data.body[0].count;
      });
    }

    // init
    getDeptRequirementConfirmList();
    getDeptInfoResourceList();

    function getDeptRequirementConfirmList() {
      _httpConfirmParams.response_dep_id = DEP_ID;
      $scope.reqConfirmPromise = Http.getDepartmentRequirementList(_httpConfirmParams).then(function(result) {
        $scope.requirementConfirmList = result.data.body[0].results;
        $scope.Paging.totalItems = result.data.body[0].count;
      })
    }

    function getDeptInfoResourceList() {
      Http.getDeptInfoResourceList(_httpModalParams).then(function(result) {
        console.log(result);
        $scope.depInfoResourceList = result.data.body[0].results;
        $scope.ModalPaging.totalItems = result.data.body[0].count;
      });
    }

    $scope.searchDeptReqConfirmByName = function() {
      _httpConfirmParams.requiement_name = $scope.DeptRequirementConfirm.req_name_filter;
      _httpConfirmParams.limit = 10;
      _httpConfirmParams.skip = 0;
      getDeptRequirementConfirmList();
    }

    // 获取信息资源格式字典
    Http.getSystemDictByCatagory({
      'dict_category': RESOURCE_FORMAT
    }).then(function(result) {
      $scope.resourceFormatList = result.data.body;
    });


    // filter by resource format
    $scope.resFormatMainSelection = [];
    $scope.getInfoResourceByResFormat = function(item) {
      var idx = $scope.resFormatMainSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.resFormatMainSelection = [];
      } else {
        $scope.resFormatMainSelection = item.id;
      }
      _httpModalParams.resource_format = $scope.resFormatMainSelection;
      _httpModalParams.limit = 10;
      _httpModalParams.skip = 0;
      getDeptInfoResourceList(_httpModalParams);
    }

    // resource format all
    $scope.getResFormatAll = function() {
      $scope.resFormatMainSelection = [];
      _httpModalParams.resource_format = null;
      _httpModalParams.limit = 10;
      _httpModalParams.skip = 0;
      getDeptInfoResourceList(_httpModalParams);
    }

    // 点击展开
    $scope.openItems = function(index, resourceId) {
      $scope.collapseIndex = index;
      $scope.closeShow = true;
      $scope.showIndex = index;
      $scope.InfoItems = [];
      Http.getInfoItemList({
        resource_id: resourceId
      }).then(function(result) {
        if (result.data.body.length == 0) {
          $scope.InfoItemShow = false;
        } else {
          $scope.InfoItemShow = true;
          $scope.InfoItems = result.data.body;

          _($scope.InfoItems).forEach(function(item) {
            var shareFreqDictName = [];
            _(item.config).forEach(function(config) {
              shareFreqDictName.push(config.dict_name);
            })
            item.update_period_name = shareFreqDictName.toString();
          })
        }


      })
    }

    // 点击收起
    $scope.closeItems = function(index) {
      $scope.collapseIndex = -1;
      $scope.closeShow = false;
      $scope.InfoItems = [];
    }

    // 选中信息资源
    $scope.resourceSelection = [];
    $scope.toggleResourceSelection = function(resourceId) {
      var idx = $scope.resourceSelection.indexOf(resourceId);
      // is currently selected
      if (idx > -1) {
        $scope.resourceSelection = [];
      }

      // is newly selected
      else {
        $scope.resourceSelection = resourceId;
        $scope.resource_id = resourceId;
        $scope.resourceItemSelection = []; //清空信息项

      }
      console.log($scope.resourceItemSelection);
    };

    // 选中信息项checkbox事件
    $scope.resourceItemSelection = [];
    $scope.toggleResItemSelection = function(resourceId, item) {
      if($scope.resource_id != resourceId) {
        $scope.resourceItemSelection = [];
        $scope.resource_id = resourceId;
      }
      var idx = $scope.resourceItemSelection.indexOf(item.id);
      // is currently selected
      if (idx > -1) {
        $scope.resourceItemSelection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.resourceItemSelection.push(item.id);
        $scope.resourceSelection = [];// 清空信息资源选中项
      }
      console.log($scope.resourceItemSelection);
    };

    // 保存选中的信息资源或信息项
    $scope.saveChooseResource = function() {
      console.log($scope.resourceItemSelection);
      console.log($scope.resourceSelection);
      if($scope.resourceItemSelection.length == 0 && $scope.resourceSelection.length == 0) {
        $scope.errorMsg = '您未选中任何资源。';
      }
      else{
        $scope.resParent.dropListShow = false;
      }
    }

    $scope.toConfirm = function(item) {
      // get requirement detail
      $scope.Modal.ReqDetail = item;
      // 初始化选项状态
      $scope.Modal.ReqResponse = {};
      $scope.resourceItemSelection = [];
      $scope.resourceSelection = [];
      $scope.resource_id = null;
      $scope.closeShow = false;
      $scope.showIndex = -1;
      $scope.collapseIndex = -1;

      if ($scope.depInfoResourceList.length == 0) {
        $scope.Modal.ReqResponse.resource_id = '';
        $scope.errorMsg = '本部门还未发布任何信息资源';
        $scope.dataQuotaIdNull = true;
      }
      // else{
      //   $scope.Modal.ReqResponse.resource_id = _.map($scope.outputResource,'id');
      // }

      Component.popModalConfirm($scope, '', 'confirm-req-modal').result.then(function() {
        $scope.Modal.ReqResponse.resource_id = $scope.resource_id;

        console.log($scope.Modal.ReqResponse);
        console.log($scope.resourceItemSelection);
        $scope.Modal.ReqResponse.requiement_id = item.id;

        Http.updateRequirement($scope.Modal.ReqResponse).then(function(result) {
          if (200 == result.data.head.status) {
            if ($scope.Modal.ReqResponse.status == 1) {
              var http_params = [];
              if($scope.resourceItemSelection.length == 0) {
                var obj = {};
                obj.requiement_id = item.id;
                obj.resource_id = $scope.Modal.ReqResponse.resource_id,
                obj.item_id = '';
                http_params.push(obj);
              }
              else{
                _($scope.resourceItemSelection).forEach(function(value) {
                  var obj = {};
                  obj.requiement_id = item.id;
                  obj.resource_id = $scope.Modal.ReqResponse.resource_id,
                  obj.item_id = value;
                  http_params.push(obj);
                });
              }
              // 保存需求响应
              Http.saveReqResponse(http_params).then(function(saveResult) {
                if (200 == saveResult.data.head.status) {
                  alert('保存成功！');
                  getDeptRequirementConfirmList();
                } else {
                  alert('保存失败！');
                  getDeptRequirementConfirmList();
                }
              })
            } else {
              alert('保存成功！');
              getDeptRequirementConfirmList();
            }

          } else {
            alert('保存失败');
          }
        })
      });
    }

    // 根据确认状态过滤
    $scope.filterByConfirmStatus = function(status) {
      _httpConfirmParams.requiement_status = status;
      getDeptRequirementConfirmList();
    }

  }
])

/** DepartmentReq Controller */
DepartmentReq.controller('Department.Requirement.Controller.detail', ['$scope', '$stateParams', 'Department.Requirement.Service.Http', 'Department.Requirement.Service.Component',
    function($scope, $stateParams, Http, Component) {
      console.log($stateParams.ID);
      Http.getReqDetail({
        requiement_id: $stateParams.ID
      }).then(function(result) {
        console.log(result.data.body[0]);
        $scope.ReqDetail = result.data.body[0];
      })
    }
  ])
  /* HTTP Factory */
DepartmentReq.factory('Department.Requirement.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;

    function getDepartmentRequirementList(params) {
      return $http.get(
        path + '/data_requiement', {
          params: params
        }
      )
    };

    function publishRequirement(data) {
      return $http.post(
        path + '/data_requiement', {
          data: data
        }
      )
    }

    // 需求确认修改状态
    function updateRequirement(data) {
      return $http.put(
        path + '/data_requiement_ok', {
          data: data
        }
      )
    }

    // 修改需求信息
    function updateRequirementInfo(data) {
      return $http.put(
        path + '/data_requiement', {
          data: data
        }
      )
    }

    function saveReqResponse(data) {
      return $http.post(
        path + '/data_requiement_response', {
          data: data
        }
      )
    }

    function getDeptInfoResourceList(params) {
      return $http.get(
        path + '/dep_resource_list', {
          params: params
        }
      )
    }

    function getReqDetail(params) {
      return $http.get(
        path + '/data_requiement_detail', {
          params: params
        }
      )
    }

    function getResponseList(params) {
      return $http.get(
        path + '/requirement/requireResponseList', {
          params: params
        }
      )
    }

    function getDepartmentList() {
      return $http.get(
        path + '/sys_dep'
      )
    }

    function deleteRequirement(id) {
      return $http.delete(
        path + '/data_requiement', {
          data: id
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

    function getReqUpdatePeriod(params) {
      return $http.get(
        path + '/requiement_update_period', {
          params: params
        }
      )
    }

    function getReqAreaLevel(params) {
      return $http.get(
        path + '/requiement_area_level', {
          params: params
        }
      )
    }

    function getInfoItemList(params) {
      return $http.get(
        path + '/allitem_detail', {
          params: params
        }
      )
    }

    return {
      getDepartmentRequirementList: getDepartmentRequirementList,
      publishRequirement: publishRequirement,
      getReqDetail: getReqDetail,
      getResponseList: getResponseList,
      updateRequirement: updateRequirement,
      updateRequirementInfo: updateRequirementInfo,
      saveReqResponse: saveReqResponse,
      getDeptInfoResourceList: getDeptInfoResourceList,
      getDepartmentList: getDepartmentList,
      deleteRequirement: deleteRequirement,
      getSystemDictByCatagory: getSystemDictByCatagory,
      getReqUpdatePeriod: getReqUpdatePeriod,
      getReqAreaLevel: getReqAreaLevel,
      getInfoItemList: getInfoItemList
    }
  }
]);


/* Component */
DepartmentReq.service('Department.Requirement.Service.Component', ['$uibModal',
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
    // prompt Modal for confirm
    function popModalConfirm(scope, type, templateUrl) {
      scope.Modal.type = type;
      var modalInstanceConfirm = $uibModal.open({
        animation: true,
        backdrop: 'static',
        templateUrl: templateUrl + '.html',
        scope: scope,
        size: 'lg'
      });
      scope.Modal.confirm = function(isValid) {
        console.log(scope);
        if (scope.resourceSelection.length == 0 && scope.resourceItemSelection.length == 0 && scope.Modal.ReqResponse.status == 1) {
          scope.errorMsg = '请选择信息资源！';
          isValid = false;
        }
        if (isValid) {
          modalInstanceConfirm.close(scope.Modal);
        } else {
          return;
        }

      };
      scope.Modal.cancel = function() {
        modalInstanceConfirm.dismiss();
      };
      return modalInstanceConfirm;
    };
    // prompt Modal
    function popModal(scope, type, templateUrl) {
      scope.Modal.type = type;
      var modalInstance = $uibModal.open({
        animation: true,
        backdrop: 'static',
        templateUrl: templateUrl + '.html',
        scope: scope,
        size: 'lg'
      });
      scope.Modal.confirm = function(isValid) {
        console.log(scope);
        scope.submitted = true;
        if (scope.reqParent.outputDeptList.length == 0) {
          scope.error = true;
        } else if (scope.shareFreqSelection.length == 0) {} else {
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
      popModal: popModal,
      popModalConfirm: popModalConfirm
    }
  }
])
