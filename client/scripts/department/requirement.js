'use strict';
var DepartmentReq = angular.module('Department.Requirement', ['ui.router']);

/** DepartmentReq Controller */
DepartmentReq.controller('Department.Requirement.Controller.Main', ['$rootScope', '$scope', '$stateParams', 'Department.Inventory.Service.Component', 'Department.Requirement.Service.Http',
  function($rootScope, $scope, $stateParams, Component, Http) {
    // init
    getReqList();

    function getReqList() {
      Http.getDepartmentRequirementList({
        "skip": 0,
        "limit": 10
      }).then(function(result) {
        $scope.requirementList = result.data.body;
      })
    }

    $scope.publishReq = function() {
      $scope.Modal = {};
      $scope.req = {};
      Component.popModal($scope, '发布', 'add-req-modal').result.then(function() {
        Http.publishReq($scope.req).then(function(result) {
          if (200 == result.data.head.status) {
            alert('发布成功');
            getReqList();
          } else {
            alert('发布失败');
          }
        })
      });
    }

    $scope.updateReq = function(item) {
      $scope.Modal = {};
      $scope.req = item;

      Component.popModal($scope, '修改', 'add-req-modal').result.then(function() {
        Http.updateReq({
          "ID" : $scope.req.ID,
          "REQUIREMENT_NAME" : $scope.req.REQUIREMENT_NAME,
          "REQUIREMENT_DESC" : $scope.req.REQUIREMENT_DESC,
          "LINKMAN" : $scope.req.LINKMAN,
          "EMAIL":$scope.req.EMAIL
        }).then(function(result) {
          if (200 == result.data.head.status) {
            alert('修改成功');
            getReqList();
          } else {
            alert('修改失败');
          }
        })
      });
    }

    $scope.deleteReq = function(ID) {
      Http.deleteReq(ID).then(function(result) {
        if (200 == result.data.head.status) {
          alert('删除成功');
          getReqList();
        } else {
          alert('删除失败');
        }
      })
    }

  }
])

/* HTTP Factory */
DepartmentReq.factory('Department.Requirement.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;

    function getDepartmentRequirementList(params) {
      return $http.get(
        path + '/requirement/getRequirementListByDep', {
          params: params
        }
      )
    };

    function publishReq(data) {
      return $http.post(
        path + '/requirement', {
          data: data
        }
      )
    }

    function updateReq(data) {
      return $http.put(
        path + '/requirement/' , {
          data: data
        }
      )
    }

    function deleteReq(data) {
      return $http.delete(
        path + '/requirement/' , {
          data:{"ID":data}
        }
      )
    }
    return {
      getDepartmentRequirementList: getDepartmentRequirementList,
      publishReq: publishReq,
      updateReq: updateReq,
      deleteReq: deleteReq
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
