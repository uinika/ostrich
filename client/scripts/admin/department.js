'use strict';
var AdminDepartment = angular.module('Admin.Department', ['ui.router']);

/** DepartmentReq Controller */
AdminDepartment.controller('Admin.Department.Controller.Main', ['$rootScope', '$scope', '$stateParams','AdminDepartment.Service.Http', 'AdminDepartment.Service.Component','$uibModal',
  function($rootScope, $scope, $stateParams, Http, Component, $uibModal) {
    $scope.Modal = {}; // Clean scope of modal
    $scope.previousDepNames = [];
    $scope.areaNames = [];
    $scope.Paging = {};
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    $scope.Paging.pageChanged = function() {
      _httpParams.skip = $scope.Paging.currentPage - 1;
      getDepartmentList(_httpParams);
    }
    function getDepartmentList(_httpParams) {
      Http.getDepartmentList(_httpParams).then(function(result) {
        $scope.AdminDepartments = result.data.body;
      });
    }
    // init
    getDepartmentList(_httpParams);

    Http.getSysDict({
      // dict_category:"2"
    }).then(function(result) {
      $scope.previousDepNames = result.data.body;
    });
    Http.getSysDict({
      dict_category:"2"
    }).then(function(result) {
      $scope.areaNames = result.data.body;
    });
    // add Department
    $scope.addDepartmentModal = function() {
      $scope.Modal = {}; // Clean scope of modal
      $scope.department = {}; // Clean scope of modal

      Component.popModal($scope, '添加', 'add-department-modal').result.then(function() {
        Http.saveDepartment($scope.department).then(function(result) {
          if (200 == result.data.head.status) {
            alert('添加成功');
            _httpParams.limit = 10;
            _httpParams.skip = 0;
            getDepartmentList(_httpParams);
          }
          else{
            alert('添加失败');
          }
        })
      });
    }
    $scope.updateDepartment = function(AdminDep) {
      AdminDep.dep_name = null;
      $scope.department = AdminDep;
      Component.popModal($scope, '修改', 'add-department-modal').result.then(function() {
        Http.updateDepartment($scope.department).then(function(result) {
          if (200 == result.data.head.status) {
            alert('修改成功');
            _httpParams.limit = 10;
            _httpParams.skip = 0;
            getDepartmentList(_httpParams);
          }
          else{
            alert('修改失败');
          }
        })
      });
    }

    $scope.deleteDepartment = function(AdminDep) {
      var flag = confirm("确定要删除吗？");
      if (flag) {
        Http.deleteDepartment(AdminDep).then(function(result) {
          _httpParams.limit = 10;
          _httpParams.skip = 0;
          if (200 == result.data.head.status) {
            alert('删除成功');
            getDepartmentList(_httpParams);
          }
          else{
            alert('删除失败！');
          }
          getDepartmentList(_httpParams);
        })
      }else{
        alert('已取消删除！');
      }
    }

    //search department
    $scope.searchDepartment = function(){
      Http.getDepartmentList({
        'dep_name': $scope.dep_name
      }).then(function(result) {
        if(200 == result.data.head.status){
          $scope.AdminDepartments = result.data.body;
        }else {
          alert("输入有误，请重新输入");
        }

      });
    }

  }
])



/* HTTP */
AdminDepartment.factory('AdminDepartment.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;

    function getDepartmentList(params) {
      return $http.get(
        path + '/sys_dep',{
          params:params
        }
      )
    };
    function saveDepartment(data) {
      return $http.post(
        path + '/sys_dep', {
          data: data
        }
      )
    };
    function getSysDict(params){
      return $http.get(
        path + '/sys_dict', {
          params: params
        }
      )
    }
    function updateDepartment(data) {
      return $http.put(
        path + '/sys_dep' , {
          data: data
        }
      )
    }
    function deleteDepartment(data) {
      return $http.delete(
        path + '/sys_dep', {
            data: {"id":data.id}
        }
      )
    }

    return {
      getDepartmentList: getDepartmentList,
      saveDepartment: saveDepartment,
      getSysDict: getSysDict,
      updateDepartment: updateDepartment,
      deleteDepartment: deleteDepartment
    }
  }
]);

/* Component */
AdminDepartment.service('AdminDepartment.Service.Component', ['$uibModal',
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
