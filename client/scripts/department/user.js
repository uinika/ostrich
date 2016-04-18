'use strict';
var SystemUser = angular.module('Department.SystemUser', ['ui.router']);

/** Main Controller */
SystemUser.controller('Department.SystemUser.Controller.Main', ['$scope', '$q', 'Department.SystemUser.Service.Http', 'Department.SystemUser.Service.Component', '$uibModal',
  function($scope, $q, Http, Component, $uibModal) {
    $scope.Modal = {}; // Clean scope of modal
    $scope.deptList = [];

    function getUserList() {
      Http.getUserList().then(function(result) {
        $scope.users = result.data.body;
      });
    }
    Http.getDepartmentList().then(function(result) {
      $scope.deptList = result.data.body;
    });

    // init
    getUserList();

    // add user
    $scope.addUserModal = function() {
      $scope.Modal = {}; // Clean scope of modal
      $scope.sysUser = {}; // Clean scope of modal

      Component.popModal($scope, '添加', 'add-user-modal').result.then(function() {
        Http.saveUser($scope.sysUser).then(function(result) {
          if (200 == result.data.head.status) {
            alert('添加成功');
            getUserList();
          }
          else{
            alert('添加失败');
          }
        })
      });

    }

    $scope.updateUser = function(user) {
      user.DEP_NAME = null;
      $scope.sysUser = user;
      Component.popModal($scope, '修改', 'add-user-modal').result.then(function() {
        Http.updateUser($scope.sysUser).then(function(result) {
          if (200 == result.data.head.status) {
            alert('修改成功');
            getUserList();
          }
          else{
            alert('修改失败');
          }
        })
      });
    }

    $scope.deleteUser = function(user) {
      console.log(user);
      Http.deleteUser(user).then(function(result) {
        console.log(result.data);
        if (200 == result.data.head.status) {
          alert('删除成功');
          getUserList();
        }
        else{
          alert('删除失败！');
        }
        getUserList();
      })
    }


  }
])


/* HTTP */
SystemUser.factory('Department.SystemUser.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function getUserList() {
      return $http.get(
        path + '/user'
      )
    };

    function saveUser(data) {
      return $http.post(
        path + '/user', {
          data: data
        }
      )
    };

    function getDepartmentList() {
      return $http.get(
        path + '/dep/'
      )
    }

    function updateUser(data) {
      return $http.put(
        path + '/user/' , {
          data: data
        }
      )
    }

    function deleteUser(data) {
      return $http.delete(
        path + '/user', {
            data: {"ID":data.ID}
        }
      )
    }
    return {
      getUserList: getUserList,
      saveUser: saveUser,
      getDepartmentList: getDepartmentList,
      updateUser: updateUser,
      deleteUser: deleteUser
    }
  }
]);

/* Component */
SystemUser.service('Department.SystemUser.Service.Component', ['$uibModal',
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
