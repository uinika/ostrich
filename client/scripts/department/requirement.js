'use strict';
var DepartmentReq = angular.module('Department.Requirement', ['ui.router']);

/** DepartmentReq Controller */
DepartmentReq.controller('Department.Requirement.Controller.Main', ['$cookies', '$scope', '$stateParams', 'Department.Requirement.Service.Component', 'Department.Requirement.Service.Http',
  function($cookies, $scope, $stateParams, Component, Http) {
    var LoginUser = JSON.parse($cookies.get('User'));
    var DEP_ID = LoginUser.dep_id;
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

    function getDeptRequirementList() {
      _httpParams.dep_id = DEP_ID;
      Http.getDepartmentRequirementList(_httpParams).then(function(result) {
        $scope.requirementList = result.data.body[0].results;
        $scope.Paging.totalItems = result.data.body[0].count;
      })
    }

    $scope.dataLevelReqSelection = [];
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

    Http.getDepartmentList().then(function(result) {
      $scope.deptList = result.data.body;
      var evens = _.remove($scope.deptList, function(item) {
        return item.id == DEP_ID;
      });
    });

    $scope.publishReq = function() {
      $scope.Modal = {};
      $scope.Modal.DepRequirment = {};
      var _httpPublishParams = {};
      var dataRelationConfig = [];
      $scope.reqParent = {};

      Component.popModal($scope, '发布', 'add-req-modal').result.then(function() {
        _($scope.dataLevelReqSelection).forEach(function(value) {
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
    $scope.deleteReqFlag = false;
    $scope.deleteReq = function(id) {
      $scope.deleteReqFlag = !$scope.deleteReqFlag;
      Http.deleteRequirement({
        id: id,
        delete_flag: $scope.deleteReqFlag
      }).then(function(result) {

      })
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
      Http.getDepartmentRequirementList(_httpConfirmParams).then(function(result) {
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

    Http.getDepartQuotaList({
      dep_name: DEP_ID
    }).then(function(result) {
      console.log(result);
      $scope.depQuotaReqList = result.data.body[0].results;

      //  $scope.Paging.totalItems = data.head.total;
    });

    $scope.toConfirm = function(item) {
      // get requirement detail
      $scope.Modal.ReqDetail = item;
      $scope.Modal.ReqResponse = {};
      $scope.Modal.ReqResponse.data_quota_id = $scope.depQuotaReqList[0].id;
      Component.popModalConfirm($scope, '', 'confirm-req-modal').result.then(function() {
        console.log($scope.Modal.ReqResponse);
        $scope.Modal.ReqResponse.id = item.id;
        Http.updateRequirement($scope.Modal.ReqResponse).then(function(result) {
          if (200 == result.data.head.status) {
            if ($scope.Modal.ReqResponse.status == 1) {
              // 保存需求响应
              Http.saveReqResponse({
                requiement_id: item.id,
                data_quota_id: $scope.Modal.ReqResponse.data_quota_id
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
      Http.getReqDetail({
        data_requiement_id: $stateParams.ID
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

    function updateRequirement(data) {
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

    function getDepartQuotaList(params) {
      return $http.get(
        path + '/data_quota', {
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
      return $http.put(
        path + '/data_requiement_delete', {
          data: data
        }
      )
    }
    return {
      getDepartmentRequirementList: getDepartmentRequirementList,
      publishRequirement: publishRequirement,
      getReqDetail: getReqDetail,
      getResponseList: getResponseList,
      updateRequirement: updateRequirement,
      saveReqResponse: saveReqResponse,
      getDepartQuotaList: getDepartQuotaList,
      getDepartmentList: getDepartmentList,
      deleteRequirement: deleteRequirement
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
