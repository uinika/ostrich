'use strict';
var AdminUser = angular.module('Admin.User', ['ui.router']);

/** DepartmentReq Controller */
AdminUser.controller('Admin.User.Controller.Main', ['$rootScope', '$scope', '$stateParams','AdminUser.Service.Http', 'AdminUser.Service.Component','$uibModal',
  function($rootScope, $scope, $stateParams, Http, Component, $uibModal) {
    $scope.Modal = {}; // Clean scope of modal
    $scope.deptList = [];
    function getUserList() {
      Http.getUserList({
        "dep_id":$rootScope.User.dep_id
      }).then(function(result) {
        $scope.users = result.data.body;
      });
    }
    // init
    getUserList();
    Http.getUserTotal({
      "dep_id":$rootScope.User.dep_id
    }).then(function(result) {
      $scope.UserTotal = result.data.body[0].number;
    });
    Http.getDepartmentList().then(function(result) {
      $scope.deptList = result.data.body;
    });

    // add user
    $scope.addUserModal = function() {
      $scope.Modal = {}; // Clean scope of modal
      $scope.sysUser = {}; // Clean scope of modal

      var prom = Component.popModal($scope, '添加', 'add-user-modal');
      prom.opened.then(function() {
        $scope.Modal.validUser = function (user){
          console.log(user);
          Http.getUserList({
            "dep_id":$rootScope.User.dep_id
          }).then(function(result) {
             var users = result.data.body;
             for (var i = 0; i < users.length; i++) {
               if(users[i].username === user){
                 alert("用户名已存在,请重新输入");
                 $scope.sysUser.username ="";
               }
             }
          });
        }
        $scope.Modal.validPword = function (password){
             if($scope.sysUser.password!=password){
               alert("密码不对,请重新输入");
               $scope.password ="";
             }
        }
      });
      prom.result.then(function() {
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
      var flag = confirm("确定要删除吗？");
      if (flag) {
        Http.deleteUser(user).then(function(result) {
          if (200 == result.data.head.status) {
            alert('删除成功');
            getUserList();
          }
          else{
            alert('删除失败！');
          }
          getUserList();
        })
      }else{
        alert('已取消删除！');
      }
    }

    //search user
    $scope.searchUser = function(){
      Http.getUserList({
        'username': $scope.username
      }).then(function(result) {
        if(200 == result.data.head.status){
          $scope.users = result.data.body;
        }else {
          alert("系统没有查到"+$scope.username+"这个用户名，请重新输入");
        }

      });
    }

  }
])

/* HTTP */
AdminUser.factory('AdminUser.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;

    function getUserList(params) {
      return $http.get(
        path + '/sys_user',{
           params: params
        }
      )
    };
    function getUserTotal(params) {
      return $http.get(
        path + '/sys_user/count',{
           params: params
        }
      )
    };

    function getDepartmentList(params) {
      return $http.get(
        path + '/sys_dep',{
          params: params
        }
      )
    }

    function saveUser(data) {
      return $http.post(
        path + '/sys_user', {
          data: data
        }
      )
    };



    function updateUser(data) {
      return $http.put(
        path + '/sys_user' , {
          data: data
        }
      )
    }

    function deleteUser(data) {
      return $http.delete(
        path + '/sys_user', {
            data: {"id":data.id}
        }
      )
    }
    return {
      getUserList: getUserList,
      saveUser: saveUser,
      getDepartmentList: getDepartmentList,
      updateUser: updateUser,
      deleteUser: deleteUser,
      getUserTotal: getUserTotal
    }
  }
]);

/* Component */
AdminUser.service('AdminUser.Service.Component', ['$uibModal',
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
