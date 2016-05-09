'use strict';
var DepartmentReq = angular.module('Department.Requirement', ['ui.router']);

/** DepartmentReq Controller */
DepartmentReq.controller('Department.Requirement.Controller.Main', ['$rootScope', '$scope', '$stateParams', 'Department.Requirement.Service.Component', 'Department.Requirement.Service.Http',
  function($rootScope, $scope, $stateParams, Component, Http) {
    var DEP_ID = $rootScope.User.dep_id;
    $scope.DeptRequirement = {};

    $scope.Paging = {};
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    $scope.Paging.pageChanged = function() {
      _httpParams.skip = $scope.Paging.currentPage - 1;
      getDeptRequirementList(_httpParams);
    }

    // init
    getDeptRequirementList();

    function getDeptRequirementList() {
      _httpParams.dep_id = DEP_ID;
      Http.getDepartmentRequirementList(_httpParams).then(function(result) {
        $scope.requirementList = result.data.body;
        $scope.Paging.totalItems = result.data.head.total;
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

      Component.popModal($scope, '发布', 'add-req-modal').result.then(function() {
        _($scope.dataLevelReqSelection).forEach(function(value) {
          var req_sys_dict = {};
          req_sys_dict.datarequiementId = $scope.Modal.DepRequirment.requiement_name;
          req_sys_dict.sys_dict_id = value;
          req_sys_dict.obj_type = 2;
          dataRelationConfig.push(req_sys_dict);
        });
        var res_dep_id = _.map($scope.outputDeptList, 'id');
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

    // $scope.updateReq = function(item) {
    //   $scope.Modal = {};
    //   $scope.req = item;
    //
    //   Component.popModal($scope, '修改', 'add-req-modal').result.then(function() {
    //     Http.updateReq({
    //       "ID" : $scope.req.ID,
    //       "REQUIREMENT_NAME" : $scope.req.REQUIREMENT_NAME,
    //       "REQUIREMENT_DESC" : $scope.req.REQUIREMENT_DESC,
    //       "LINKMAN" : $scope.req.LINKMAN,
    //       "EMAIL":$scope.req.EMAIL
    //     }).then(function(result) {
    //       if (200 == result.data.head.status) {
    //         alert('修改成功');
    //         getDeptRequirementList();
    //       } else {
    //         alert('修改失败');
    //       }
    //     })
    //   });
    // }
    //
    // $scope.deleteReq = function(ID) {
    //   Http.deleteReq(ID).then(function(result) {
    //     if (200 == result.data.head.status) {
    //       alert('删除成功');
    //       getDeptRequirementList();
    //     } else {
    //       alert('删除失败');
    //     }
    //   })
    // }

  }
])

/** DepartmentReq Controller */
// DepartmentReq.controller('Department.Requirement.Controller.detail', ['$scope', '$stateParams', 'Department.Requirement.Service.Http',
//   function( $scope, $stateParams, Http) {
//     console.log($stateParams.ID);
//     Http.getReqDetail({
//       "ID": $stateParams.ID
//     }).then(function(result) {
//       $scope.ReqDetail = result.data.body[0];
//     }).then(function(){
//       Http.getResponseList({
//         "REQUIREMENT_ID": $stateParams.ID
//       }).then(function(result) {
//         $scope.responseList = result.data.body;
//       })
//     })
//   }])

  /** DepartmentReq Controller */
  DepartmentReq.controller('Department.Requirement.Controller.confirm', ['$rootScope', '$scope', '$stateParams', 'Department.Requirement.Service.Http', 'Department.Requirement.Service.Component' ,
    function($rootScope, $scope, $stateParams, Http, Component) {
      $scope.Modal = {};
      $scope.DeptRequirementConfirm = {};

      var DEP_ID = $rootScope.User.dep_id;
      $scope.DeptRequirement = {};

      $scope.Paging = {};
      $scope.Paging.maxSize = 5;
      $scope.Paging.itemsPerPage = 10;

      var _httpConfirmParams = {};
      _httpConfirmParams.limit = 10;
      _httpConfirmParams.skip = 0;

      $scope.Paging.pageChanged = function() {
        _httpConfirmParams.skip = $scope.Paging.currentPage - 1;
        getDeptRequirementConfirmList(_httpConfirmParams);
      }

      // init
      getDeptRequirementConfirmList();

      function getDeptRequirementConfirmList() {
        _httpConfirmParams.response_dep_id = DEP_ID;
        Http.getDepartmentRequirementList(_httpConfirmParams).then(function(result) {
          $scope.requirementConfirmList = result.data.body;
          $scope.Paging.totalItems = result.data.head.total;
        })
      }

      $scope.searchDeptReqConfirmByName = function() {
        _httpConfirmParams.requiement_name = $scope.DeptRequirementConfirm.req_name_filter;
        _httpConfirmParams.limit = 10;
        _httpConfirmParams.skip = 0;
        getDeptRequirementConfirmList();
      }

      Http.getDepartQuotaList().then(function(result) {
        console.log(result);
        $scope.depQuotaReqList = result.data.body;
        //  $scope.Paging.totalItems = data.head.total;
      });

      $scope.toConfirm = function(item) {
        // get requirement detail
        $scope.Modal.ReqDetail = item;
        Component.popModal($scope, '', 'confirm-req-modal').result.then(function() {
          console.log($scope.Modal.ReqResponse);
          $scope.Modal.ReqResponse.id = item.id;
          Http.updateRequirement($scope.Modal.ReqResponse).then(function(result) {
            if (200 == result.data.head.status) {
              // 保存需求响应
              Http.saveReqResponse({
                requiement_id: item.id,
                data_quota_id: $scope.Modal.ReqResponse.data_quota_id
              }).then(function(saveResult) {
                if (200 == saveResult.data.head.status) {
                  alert('确认成功');
                  getDeptRequirementConfirmList();
                }
              })

            } else {
              alert('确认失败');
            }
          })
        });
      }

    }])


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
    // function updateReq(data) {
    //   return $http.put(
    //     path + '/requirement/' , {
    //       data: data
    //     }
    //   )
    // }
    //
    // function deleteReq(data) {
    //   return $http.delete(
    //     path + '/requirement/' , {
    //       data:{"ID":data}
    //     }
    //   )
    // }

    function getReqDetail(params) {
      return $http.get(
        path + '/requirement/requireDetail', {
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
    return {
      getDepartmentRequirementList: getDepartmentRequirementList,
      publishRequirement: publishRequirement,
      getReqDetail: getReqDetail,
      getResponseList: getResponseList,
      updateRequirement: updateRequirement,
      saveReqResponse: saveReqResponse,
      getDepartQuotaList: getDepartQuotaList,
      getDepartmentList: getDepartmentList
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
    // prompt Modal
    function popModal(scope, type, templateUrl) {
      scope.Modal.type = type;
      var modalInstance = $uibModal.open({
        animation: true,
        backdrop : 'static',
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
