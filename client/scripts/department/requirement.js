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
            getDeptRequirementList();
          } else {
            alert('发布失败');
          }
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
      if(deleteFlag) {
        Http.deleteRequirement({
          requiement_id: id
        }).then(function(result) {
            if (200 == result.data.head.status) {
              alert('删除成功！');
              getDeptRequirementList();
            }
            else {
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
        if(item.response_dep_id == outItem.id) {
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
            getDeptRequirementList();
          } else {
            alert('修改失败');
          }
        })
      });
    }

  }
])


/** DepartmentReq Controller */
DepartmentReq.controller('Department.Requirement.Controller.confirm', ['$cookies', '$scope', '$stateParams', 'Department.Requirement.Service.Http', 'Department.Requirement.Service.Component',
  function($cookies, $scope, $stateParams, Http, Component) {
    $scope.Modal = {};
    $scope.DeptRequirementConfirm = {};

    var LoginUser = JSON.parse($cookies.get('User'));
    var DEP_ID = LoginUser.dep_id;
    $scope.DeptRequirement = {};

    $scope.Paging = {};
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpConfirmParams = {};
    _httpConfirmParams.limit = 10;
    _httpConfirmParams.skip = 0;

    $scope.Paging.pageChanged = function() {
      _httpConfirmParams.skip = ($scope.Paging.currentPage - 1) * _httpConfirmParams.limit;
      getDeptRequirementConfirmList(_httpConfirmParams);
    }

    // init
    getDeptRequirementConfirmList();

    function getDeptRequirementConfirmList() {
      _httpConfirmParams.response_dep_id = DEP_ID;
      $scope.reqConfirmPromise = Http.getDepartmentRequirementList(_httpConfirmParams).then(function(result) {
        $scope.requirementConfirmList = result.data.body[0].results;
        $scope.Paging.totalItems = result.data.body[0].count;
      })
    }

    $scope.searchDeptReqConfirmByName = function() {
      _httpConfirmParams.requiement_name = $scope.DeptRequirementConfirm.req_name_filter;
      _httpConfirmParams.limit = 10;
      _httpConfirmParams.skip = 0;
      getDeptRequirementConfirmList();
    }

    Http.getDeptInfoResourceList().then(function(result) {
      console.log(result);
      $scope.depInfoResourceList = result.data.body[0].results;

      //  $scope.Paging.totalItems = data.head.total;
    });

    $scope.toConfirm = function(item) {
      // get requirement detail
      $scope.Modal.ReqDetail = item;
      $scope.Modal.ReqResponse = {};
      console.log($scope.depInfoResourceList.length);
      if($scope.depInfoResourceList.length == 0) {
        $scope.Modal.ReqResponse.resource_id = '';
        $scope.errorMsg = '本部门还未发布任何信息资源';
        $scope.dataQuotaIdNull = true;
      }
      else{
        $scope.Modal.ReqResponse.resource_id = $scope.depInfoResourceList[0].id;
      }

      Component.popModalConfirm($scope, '', 'confirm-req-modal').result.then(function() {
        console.log($scope.Modal.ReqResponse);
        $scope.Modal.ReqResponse.requiement_id = item.id;

        Http.updateRequirement($scope.Modal.ReqResponse).then(function(result) {
          if (200 == result.data.head.status) {
            if ($scope.Modal.ReqResponse.status == 1) {
              // 保存需求响应
              Http.saveReqResponse({
                requiement_id: item.id,
                resource_id: $scope.Modal.ReqResponse.resource_id
              }).then(function(saveResult) {
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

  }
])

/** DepartmentReq Controller */
DepartmentReq.controller('Department.Requirement.Controller.detail', [ '$scope', '$stateParams', 'Department.Requirement.Service.Http', 'Department.Requirement.Service.Component',
    function( $scope, $stateParams, Http, Component) {
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
        path + '/info_resource_list', {
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
      getReqAreaLevel: getReqAreaLevel
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
        if (isValid && scope.reqParent.outputDeptList.length > 0) {
          modalInstance.close(scope.Modal);
        } else {
          scope.error = true;
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
