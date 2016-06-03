'use strict';
var AdminUser = angular.module('Admin.User', ['ui.router','ngCookies']);

/** DepartmentReq Controller */
AdminUser.controller('Admin.User.Controller.Main', ['$cookies', '$scope', '$q', '$stateParams','AdminUser.Service.Http', 'AdminUser.Service.Component','$uibModal','$state',
  function($cookies, $scope, $q, $stateParams, Http, Component, $uibModal, $state) {
    var LoginUser = JSON.parse($cookies.get('User'));
    var dep_id = ((LoginUser.id==='e147f177-1e83-11e6-ac02-507b9d1b58bb') ? null : LoginUser.dep_id);
    var dep_name= ((LoginUser.id==='e147f177-1e83-11e6-ac02-507b9d1b58bb') ? null : LoginUser.dep_name);
    $scope.Paging = {};
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpParams = {};
    _httpParams.limit =10;
    _httpParams.skip = 0;
    _httpParams.dep_id = ((LoginUser.id==='e147f177-1e83-11e6-ac02-507b9d1b58bb') ? null : dep_id);
    $scope.Paging.pageChanged = function() {
      _httpParams.skip = ($scope.Paging.currentPage - 1)*_httpParams.limit;
      getUserList(_httpParams);
    }


    $scope.Modal = {}; // Clean scope of modal
    $scope.deptList = [];
    function getUserList(_httpParams) {
      Http.getUserList(_httpParams).then(function(result) {
        $scope.users = result.data.body;
      });
    }
    function getUserTotal(){
      Http.getUserTotal({
        "dep_id" : dep_id
      }).then(function(result) {
        console.log(LoginUser.id);
        if (LoginUser.id==='e147f177-1e83-11e6-ac02-507b9d1b58bb') {
          var tatol =  result.data.body[0].number - 1 ;
          $scope.UserTotal = tatol;
        }else {
          $scope.UserTotal = result.data.body[0].number;
        }
        $scope.Paging.totalItems = $scope.UserTotal;
      });
    }
    // init
    getUserTotal();
    getUserList(_httpParams);

    //department
    Http.getDepartmentList({
      'dep_name': dep_name
    }).then(function(result) {
      $scope.deptList = result.data.body;
    });

    $scope.placeholder = {};
    $scope.placeholder.name = "必填";
    $scope.placeholder.password = "必填";
    $scope.placeholder.password1 = "必填";
    $scope.placeholder.personName = "必填";
    $scope.placeholder.organization = "必填";
    $scope.placeholder.organization_code = "必填";
    $scope.placeholder.phone = "必填";
    $scope.placeholder.email = "必填";
    $scope.placeholder.remark = "";
    // add user
    $scope.addUserModal = function() {
      $scope.Modal = {}; // Clean scope of modal
      $scope.sysUser = {}; // Clean scope of modal
      $scope.sysUser.remark = "";
      var prom = Component.popModal($scope, '添加', 'add-user-modal');
      prom.opened.then(function() {
        $scope.Modal.validUser = function (user){
          $scope.placeholder.name ="必填";
          $scope.validUser = false;
          Http.getUserList({
            "dep_id":dep_id
          }).then(function(result) {
             var users = result.data.body;
             for (var i = 0; i < users.length; i++) {
               if(users[i].username === user){
                 $scope.validUser = true;
                 $scope.placeholder.name ="用户名已存在,请重新输入";
                 $scope.sysUser.username ="";
               }
             }
          });
        }
        $scope.Modal.validPword = function (){
          $scope.placeholder.password1 ="必填";
          $scope.validPword = false;
          if($scope.sysUser.password!=$scope.sysUser.password1&&$scope.sysUser.password1!=null){
            $scope.validPword = true;
            $scope.placeholder.password1 ="两次输入的密码不同,请重新输入";
            $scope.sysUser.password1 ="";
          }
        }
        $scope.Modal.validPhone = function (){
          $scope.placeholder.phone = "必填";
          $scope.validPhone = false ;
          var reg =/^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
          if(!reg.test($scope.sysUser.phone)&&($scope.sysUser.phone!=null)){
            $scope.validPhone = true ;
            $scope.placeholder.phone = "电话格式不对";
            $scope.sysUser.phone ="";
          }
        }
        $scope.Modal.validEmail = function (invalid){
          $scope.placeholder.email = "必填";
          $scope.validEmail = false ;
          if(invalid){
            $scope.validEmail = true ;
            $scope.placeholder.email = "邮箱格式不对";
            $scope.sysUser.email ="";
          }
        }

      });
      prom.result.then(function() {
        Http.saveUser($scope.sysUser).then(function(result) {
          if (200 == result.data.head.status) {
            alert('添加成功');
          }
          else{
            alert('保存数据库失败');
          }
          _httpParams.limit = 10;
          _httpParams.skip = 0;
          $scope.Paging.currentPage = 0 ;
          getUserList(_httpParams);
          getUserTotal();
        })
      });



    }
    $scope.updateUser = function(user) {
      $scope.sysUser = user;
      $scope.sysUser.password1 =0;
      $scope.sysUser.password = 0;
      $scope.sysUser.remark = ((user.remark) ?user.remark : "");
      var prom = Component.popModal($scope, '修改', 'add-user-modal');
      prom.opened.then(function() {
        $scope.Modal.validUser = function (user){
          $scope.placeholder.name ="必填";
          $scope.validUser = false;
          Http.getUserList({
            "dep_id":dep_id
          }).then(function(result) {
             var users = result.data.body;
             for (var i = 0; i < users.length; i++) {
               if(users[i].username === user){
                 $scope.validUser = true;
                 $scope.placeholder.name ="用户名已存在,请重新输入";
                 $scope.sysUser.username ="";
               }
             }
          });
        }
        $scope.Modal.validPhone = function (){
          $scope.placeholder.phone = "必填";
          $scope.validPhone = false ;
          var reg =/^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
          if(!reg.test($scope.sysUser.phone)&&$scope.sysUser.phone!=null){
            $scope.validPhone = true ;
            $scope.placeholder.phone = "电话格式不对";
            $scope.sysUser.phone ="";
          }
        }
        $scope.Modal.validEmail = function (invalid){
          $scope.placeholder.email = "必填";
          $scope.validEmail = false ;
          if(invalid){
            $scope.validEmail = true ;
            $scope.placeholder.email = "邮箱格式不对";
            $scope.sysUser.email ="";
          }
        }

      });
      prom.result.then(function() {
        Http.updateUser($scope.sysUser).then(function(result) {
          _httpParams.limit = 10;
          _httpParams.skip = 0;
          $scope.Paging.currentPage = 0 ;
          if (200 == result.data.head.status) {
            alert('修改成功');
          }
          else{
            alert('修改失败');
          }
          getUserList(_httpParams);
        })
      });
    }
    $scope.deleteUser = function(user) {
      if(user.id!=LoginUser.id){
        var flag = confirm("确定要删除吗？");
        if (flag) {
          Http.deleteUser(user).then(function(result) {
            _httpParams.limit = 10;
            _httpParams.skip = 0;
            $scope.Paging.currentPage = 0 ;
            if (200 == result.data.head.status) {
              alert('删除成功');
              getUserTotal();
              getUserList(_httpParams);
            }
            else{
              alert('删除失败！');
            }
            $state.go("main.admin.user", {}, {
              reload: true
            });
          })
        }
      }else{
        alert("当前登录用户不能删除！");
      }
    }

    $scope.Password = function(user) {
      $scope.placeholder.password_1 = "必填";
      $scope.placeholder.password_2 = "必填";
      $scope.placeholder.password_3 = "必填";
      var id = 0;
      id = user.id;
      $scope.Modal.password_pre = "";
      $scope.Modal.p2 = "";
      $scope.Modal.password = "";
      $scope.password_1 = false;
      $scope.password_2 = false;
      $scope.password_3 = false;
      var prom = Component.popModal($scope, '密码', 'update-password-modal');
      prom.opened.then(function() {
        $scope.Modal.validPword1 = function (){
          $scope.password_1 = false;
          $scope.placeholder.password_1 ="必填";
          Http.validatePassword({
            "id":id,
            "password":$scope.Modal.password_pre
          }).then(function(result) {
            if(result.data.head.total == 0) {
              $scope.password_1 = true;
              $scope.placeholder.password_1 ="原密码不对,请重新输入";
              $scope.Modal.password_pre = "";
            }
          });
        }
        $scope.Modal.validPword = function (){
             $scope.password_3 = false;
             $scope.placeholder.password_3 ="必填";
             if($scope.Modal.p2!=$scope.Modal.password){
               $scope.password_3 = true;
               $scope.placeholder.password_3 = "两次输入的密码不同,请重新输入";
               $scope.Modal.password ="";
             }
        }
      });

      prom.result.then(function() {
        Http.UpdatePassword({
          "id": id,
          "password":$scope.Modal.password
        }).then(function(result) {
          if (200 == result.data.head.status) {
            alert('修改成功');
          }
          else{
            alert('修改失败');
          }
          _httpParams.limit = 10;
          _httpParams.skip = 0;
          $scope.Paging.currentPage = 0 ;
          getUserList(_httpParams);
          getUserTotal();
        })
      });
    }

    //search user
    $scope.searchUser = function(){
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      _httpParams.dep_id = dep_id;
      _httpParams.sysusername = $scope.username;
      if($scope.username==null){
        getUserTotal();
        getUserList(_httpParams);
      }else{
        Http.getUserList(_httpParams).then(function(result) {
          if(result.data.head.total >= 1){
            $scope.users = result.data.body;
            $scope.UserTotal = result.data.head.total;
            $scope.Paging.totalItems = $scope.UserTotal;
          }else{
            alert("系统没有查到'"+$scope.username+"'这个用户名，请重新输入");
            $state.go("main.admin.user", {}, {
              reload: true
            });
          }
        });
      }
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
    function validatePassword(params){
      return $http.get(
        path + '/sys_user/password', {
            params: params
        }
      )
    }
    function UpdatePassword(data) {
      return $http.put(
        path + '/sys_user/password' , {
          data: data
        }
      )
    }
    return {
      getUserList: getUserList,
      saveUser: saveUser,
      getDepartmentList: getDepartmentList,
      updateUser: updateUser,
      deleteUser: deleteUser,
      getUserTotal: getUserTotal,
      validatePassword: validatePassword,
      UpdatePassword: UpdatePassword
    }
  }
]);

/* Component */
AdminUser.service('AdminUser.Service.Component', ['$uibModal','$state',
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
        scope: scope,
        size: 'md'
      });
      scope.Modal.confirm = function(isValid) {
        if (isValid) {
          modalInstance.close(scope.Modal);
        }

      };

      scope.Modal.cancel = function() {
        modalInstance.dismiss();
        $state.go("main.admin.user", {}, {
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
