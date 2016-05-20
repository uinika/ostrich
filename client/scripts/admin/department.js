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
      _httpParams.skip = ($scope.Paging.currentPage - 1)*_httpParams.limit;
      getDepartmentList(_httpParams);
    }
    //pagination
    function getDepartmentList(_httpParams) {
      Http.getDepartmentList(_httpParams).then(function(result) {
        $scope.AdminDepartments = result.data.body;
      });
      Http.getDepartmentList().then(function(result) {
        $scope.AllDepartments = result.data.body;
      });
    }

    // init
    getDepartmentList(_httpParams);
    function getDepTotal(){
      Http.getDepTotal({
      }).then(function(result) {
        $scope.depTotal = result.data.body[0].number;
        $scope.Paging.totalItems = $scope.depTotal
      });
    }
    getDepTotal();
    Http.getSysDict({
      dict_category:"7"
    }).then(function(result) {
      $scope.types = result.data.body;
    });
    Http.getSysDict({
      dict_category:"9"
    }).then(function(result) {
      $scope.areaNames = result.data.body;
    });
    // add Department
    $scope.addDepartmentModal = function() {
      $scope.Modal = {}; // Clean scope of modal
      $scope.department = {}; // Clean scope of modal

      var promise = Component.popModal($scope, '添加', 'add-department-modal');
      promise.opened.then(function() {
        $scope.Modal.validDepName = function (depName){
          Http.getDepartmentList().then(function(result) {
             var deps = result.data.body;
             for (var i = 0; i < deps.length; i++) {
               if(deps[i].dep_name === depName){
                 alert("该部门已存在,请重新添加");
                 $scope.department.dep_name ="";
               }
             }
          });
        }

      });
      promise.result.then(function() {
        Http.saveDepartment($scope.department).then(function(result) {
          if (200 == result.data.head.status) {
            alert('添加成功');
          }
          else{
            alert('添加失败');
          }
          _httpParams.limit = 10;
          _httpParams.skip = 0;
          $scope.Paging.currentPage = 0 ;
          getDepartmentList(_httpParams);
          getDepTotal();
        })
      });
    }
    $scope.updateDepartment = function(AdminDep) {
      $scope.department = AdminDep;
      _.remove($scope.AllDepartments, function(dep) {
        return (dep.dep_name == AdminDep.dep_name);
     });
      var promise = Component.popModal($scope, '修改', 'add-department-modal');
      promise.opened.then(function() {

      });
      promise.result.then(function() {
        Http.updateDepartment($scope.department).then(function(result) {
          _httpParams.limit = 10;
          _httpParams.skip = 0;
          $scope.Paging.currentPage = 0 ;
          if (200 == result.data.head.status) {
            alert('修改成功');
          }
          else{
            alert('修改失败');
          }
          getDepartmentList(_httpParams);
        })
    });
    }

    $scope.deleteDepartment = function(AdminDep) {
      var flag = confirm("确定要删除吗？");
      if (flag) {
        Http.deleteDepartment(AdminDep).then(function(result) {
          _httpParams.limit = 10;
          _httpParams.skip = 0;
          $scope.Paging.currentPage = 0 ;
          if (200 == result.data.head.status) {
            alert('删除成功');
          }
          else{
            alert('删除失败！');
          }
          getDepTotal();
          getDepartmentList(_httpParams);
        })
      }
    }

    //search department
    $scope.searchDepartment = function(){
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      _httpParams.sysdepname = $scope.dep_name;
      Http.getDepartmentList(_httpParams).then(function(result) {
        if($scope.dep_name==null){
          getDepTotal();
          getDepartmentList(_httpParams);
        }else{

          if(result.data.head.total >=1){
            $scope.AdminDepartments = result.data.body;
            $scope.depTotal = result.data.head.total;
            $scope.Paging.totalItems =  $scope.depTotal
          }else {
            alert("系统没有查到'"+$scope.dep_name+"'这个部门，请重新输入");
            $scope.dep_name = "";
          }
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

    function getDepTotal() {
      return $http.get(
        path + '/sys_dep/count'
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
      getDepTotal: getDepTotal,
      saveDepartment: saveDepartment,
      getSysDict: getSysDict,
      updateDepartment: updateDepartment,
      deleteDepartment: deleteDepartment
    }
  }
]);

/* Component */
AdminDepartment.service('AdminDepartment.Service.Component', ['$uibModal','$state',
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
        $state.go("main.admin.department", {}, {
          reload: true
        });
      };
      return modalInstance;
    };

    return {
      popAlert: popAlert,
      popModal: popModal
    }
  }
])
